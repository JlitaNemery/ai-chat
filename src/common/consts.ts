export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
export const GROQ_MODEL_NAME = import.meta.env.VITE_GROQ_MODEL_NAME;

export const HELP_DETAILS = `
### 🤖 AI Chat Features:
- 💬 **Real-time AI Chat:** Ask any question and receive instant responses.
- 🌙 **Dark/Light Mode:** Customize the theme in **Settings**.
- 🗑️ **Clear Chat History:** Delete past conversations for a specific session in **Settings**.
- 📂 **Session-Based Message Storage:** Messages are saved **per session ID** and automatically loaded when you revisit \`/chat/:sessionId\`.
- 🔍 **Help Command:** Type \`/help\` to see this message again.
`;
