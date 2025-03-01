import styled from 'styled-components';
import { Typography, IconButton } from '@mui/material';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';

const HeaderContainer = styled.header.withConfig({
  shouldForwardProp: (prop) => prop !== 'darkMode',
})<{ darkMode: boolean }>`
  width: 100%;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  background: ${({ darkMode }) => (darkMode ? '#333' : '#1976d2')}; /* ✅ Dynamic background */
  color: ${({ darkMode }) => (darkMode ? '#fff' : '#fff')}; /* ✅ Ensures contrast */
`;

const Title = styled(Typography).attrs({ variant: 'h6' })`
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default function Header() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const openSettings = () => {
    navigate('?settings=true');
  };

  return (
    <HeaderContainer darkMode={darkMode}>
      <Title>Groq AI Chat</Title>
      <ButtonContainer>
        <IconButton onClick={openSettings} color="inherit">
          <SettingsIcon />
        </IconButton>
      </ButtonContainer>
    </HeaderContainer>
  );
}
