import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ThemeProviderWrapper } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProviderWrapper>
      <ChatProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChatProvider>
    </ThemeProviderWrapper>
  </StrictMode>
);
