import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

type ChatInputProps = {
  sendMessage: (message: string) => void;
  loading: boolean;
};

export default function ChatInput({ sendMessage, loading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <Box display="flex" mt={2}>
      <TextField
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        variant="outlined"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !loading) {
            handleSend();
          }
        }}
      />
      <Button onClick={handleSend} variant="contained" sx={{ ml: 1 }} disabled={loading}>
        {loading ? 'Typing...' : 'Send'}
      </Button>
    </Box>
  );
}
