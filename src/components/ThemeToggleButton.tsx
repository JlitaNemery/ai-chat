import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';

export default function ThemeToggleButton() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <IconButton onClick={toggleTheme} sx={{ alignSelf: 'flex-end', mb: 1 }}>
      {darkMode ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
}
