import { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal, Box, Typography, Switch, Button, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeContext } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import { GROQ_MODEL_NAME } from '../common/consts';
import styled from 'styled-components';

const ModalContainer = styled(Box).withConfig({
  shouldForwardProp: (prop) => prop !== 'darkMode',
})<{ darkMode: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: ${({ darkMode }) => (darkMode ? '#1e1e1e' : '#fff')};
  color: ${({ darkMode }) => (darkMode ? '#fff' : '#000')};
`;

export default function SettingsModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, dispatch } = useChat();
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [dialogOpen, setDialogOpen] = useState(false);

  const sessionId = state.sessionId;

  const closeModal = () => {
    searchParams.delete('settings');
    setSearchParams(searchParams);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const confirmClearChatHistory = () => {
    if (!sessionId) {
      setSnackbarMessage('No chat session found!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    dispatch({ type: 'CLEAR_MESSAGES' });
    setSnackbarMessage('Chat history cleared successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    closeDialog();
  };

  return (
    <>
      <Modal open onClose={closeModal} disableEnforceFocus>
        <ModalContainer darkMode={darkMode}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Settings</Typography>
            <IconButton onClick={closeModal} color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography>Groq Model:</Typography>
            <Typography fontWeight="bold">{GROQ_MODEL_NAME}</Typography>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography>Dark Mode</Typography>
            <Switch checked={darkMode} onChange={toggleTheme} />
          </Box>

          <Button variant="contained" color="error" onClick={openDialog} disabled={!sessionId}>
            Clear Chat History
          </Button>

          <Button variant="contained" color="primary" onClick={closeModal}>
            Close
          </Button>

          <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled">
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </ModalContainer>
      </Modal>

      <Dialog open={dialogOpen} onClose={closeDialog} disableAutoFocus>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to clear the chat history? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmClearChatHistory} color="error" variant="contained">
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
