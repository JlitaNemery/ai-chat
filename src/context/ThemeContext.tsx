import { createContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeContextType = {
  darkMode: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({ darkMode: false, toggleTheme: () => {} });

export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setDarkMode(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setDarkMode((prev) => !prev);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      background: {
        default: darkMode ? '#121212' : '#f9f9f9',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
