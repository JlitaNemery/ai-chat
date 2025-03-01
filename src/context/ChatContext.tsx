import { createContext, useReducer, useContext, ReactNode } from 'react';

type Message = {
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
};

interface ChatState {
  sessionId: string | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_LAST_BOT_MESSAGE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' };

const initialState: ChatState = {
  sessionId: null,
  messages: [],
  loading: false,
  error: null,
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_SESSION_ID': {
      const sessionId = action.payload;
      const savedMessages = localStorage.getItem(`chat-messages-${sessionId}`);
      return {
        ...state,
        sessionId,
        messages: savedMessages ? JSON.parse(savedMessages) : [],
      };
    }

    case 'ADD_MESSAGE': {
      if (!state.sessionId) return state;
      const newMessages = [...state.messages, action.payload];

      localStorage.setItem(`chat-messages-${state.sessionId}`, JSON.stringify(newMessages));

      return { ...state, messages: newMessages };
    }

    case 'UPDATE_LAST_BOT_MESSAGE': {
      if (!state.sessionId) return state;
      const newMessages = [...state.messages];
      const lastMessageIndex = newMessages.length - 1;

      if (newMessages[lastMessageIndex]?.sender === 'bot') {
        newMessages[lastMessageIndex] = { ...newMessages[lastMessageIndex], text: action.payload };
        localStorage.setItem(`chat-messages-${state.sessionId}`, JSON.stringify(newMessages));
      }

      return { ...state, messages: newMessages };
    }

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_MESSAGES': {
      if (!state.sessionId) return state;
      localStorage.removeItem(`chat-messages-${state.sessionId}`);
      return { ...state, messages: [] };
    }

    default:
      return state;
  }
};

const ChatContext = createContext<{ state: ChatState; dispatch: React.Dispatch<ChatAction> } | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return <ChatContext.Provider value={{ state, dispatch }}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
