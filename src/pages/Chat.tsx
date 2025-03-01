import { useEffect, useRef, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Avatar, Snackbar, Alert } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Groq from 'groq-sdk';
import { GROQ_API_KEY, GROQ_MODEL_NAME, HELP_DETAILS } from '../common/consts';
import { ThemeContext } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import ChatInput from '../components/ChatInput';

const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

type Message = {
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
};

const TypingIndicator = styled(motion.div)`
  display: flex;
  gap: 4px;
  padding: 8px;
  color: gray;

  span {
    width: 6px;
    height: 6px;
    background: gray;
    border-radius: 50%;
    animation: typing 1.2s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes typing {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.3);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }
`;

const ChatContainer = styled(Box).withConfig({
  shouldForwardProp: (prop) => prop !== 'darkMode',
})<{ darkMode: boolean }>`
  max-width: 600px;
  margin: auto;
  padding: 16px;
  border: 1px solid ${({ darkMode }) => (darkMode ? '#444' : '#ddd')};
  border-radius: 8px;
  background: ${({ darkMode }) => (darkMode ? '#1e1e1e' : '#f9f9f9')};
  color: ${({ darkMode }) => (darkMode ? '#fff' : '#000')};
  display: flex;
  flex-direction: column;
  height: 80vh;
`;

const MessagesContainer = styled(Box).withConfig({
  shouldForwardProp: (prop) => prop !== 'darkMode',
})<{ darkMode: boolean }>`
  flex-grow: 1;
  overflow-y: auto;
  border-bottom: 1px solid #ddd;
  padding: 10px;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ darkMode }) => (darkMode ? '#444' : '#f1f1f1')};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ darkMode }) => (darkMode ? '#888' : '#c1c1c1')};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ darkMode }) => (darkMode ? '#666' : '#a1a1a1')};
  }
`;

const MessageRow = styled(Box)<{ sender: 'user' | 'bot' }>`
  display: flex;
  align-items: flex-end;
  margin: 5px 0;
  ${({ sender }) => (sender === 'user' ? 'flex-direction: row-reverse;' : 'flex-direction: row;')}
`;

const MessageBubble = styled(motion.div)<{ sender: 'user' | 'bot'; darkMode: boolean }>`
  display: inline-block;
  padding: 10px;
  border-radius: 8px;
  margin: 5px;
  max-width: 75%;
  background-color: ${(props) => (props.sender === 'user' ? (props.darkMode ? '#2979ff' : '#d1e7fd') : props.darkMode ? '#444' : '#e5e5e5')};
  color: ${(props) => (props.darkMode ? '#fff' : '#000')};
`;

const Timestamp = styled(Box)`
  display: flex;
  font-size: 0.75rem;
  color: gray;
  text-align: right;
`;

export default function Chat() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { state, dispatch } = useChat();
  const { darkMode } = useContext(ThemeContext);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isTyping = useRef<boolean>(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (sessionId) {
      dispatch({ type: 'SET_SESSION_ID', payload: sessionId });
    }
  }, [sessionId, dispatch]);

  useEffect(() => {
    if (state.messages.length === 0) return;

    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage.sender === 'user') {
      scrollToBottom();
    } else if (lastMessage.sender === 'bot' && !isTyping.current) scrollToBottom();
  }, [state.messages]);

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim() || state.loading) return;

    const userMessage: Message = { text: input, sender: 'user', timestamp: Date.now() };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

    if (input.trim() === '/help') {
      dispatch({ type: 'ADD_MESSAGE', payload: { text: HELP_DETAILS, sender: 'bot', timestamp: Date.now() } });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'ADD_MESSAGE', payload: { text: '', sender: 'bot', timestamp: Date.now() } });
    isTyping.current = true;
    await new Promise((resolve) => setTimeout(resolve, 200)); // Delay for better UX
    scrollToBottom();

    try {
      let botResponse = '';

      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL_NAME,
        messages: [{ role: 'user', content: input }],
        stream: true,
      });

      for await (const chunk of completion) {
        const chunkText = chunk.choices[0].delta.content || '';
        botResponse += chunkText;

        dispatch({
          type: 'UPDATE_LAST_BOT_MESSAGE',
          payload: botResponse,
        });
      }
    } catch (error) {
      console.error('Groq API Error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error fetching response from bot. Please try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      isTyping.current = false;
    }
  }, []);

  return (
    <ChatContainer darkMode={darkMode}>
      <Snackbar
        open={Boolean(state.error)}
        autoHideDuration={3000}
        onClose={() => dispatch({ type: 'SET_ERROR', payload: null })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => dispatch({ type: 'SET_ERROR', payload: null })} severity="error" variant="filled">
          {state.error}
        </Alert>
      </Snackbar>

      <MessagesContainer darkMode={darkMode}>
        {state.messages.map((msg) => (
          <MessageRow key={msg.sender + msg.timestamp} sender={msg.sender}>
            <Box>
              <Avatar
                src={msg.sender === 'user' ? '/user-avatar.png' : '/bot-avatar.png'}
                alt={msg.sender === 'user' ? 'User' : 'Bot'}
                sx={{ width: 32, height: 32, marginRight: msg.sender === 'bot' ? '10px' : '0', marginLeft: msg.sender === 'user' ? '10px' : '0' }}
              />
              <Timestamp>{new Date(msg.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</Timestamp>
              <Box>
                <MessageBubble sender={msg.sender} darkMode={darkMode}>
                  {msg.text === '' ? (
                    <TypingIndicator>
                      <span></span>
                      <span></span>
                      <span></span>
                    </TypingIndicator>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  )}
                </MessageBubble>
              </Box>
            </Box>
          </MessageRow>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <ChatInput sendMessage={sendMessage} loading={state.loading} />
    </ChatContainer>
  );
}
