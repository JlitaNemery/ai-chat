import { render } from 'vitest-browser-react';
import { expect, test, vi, Mock } from 'vitest';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { screen } from '@testing-library/react';

vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

test('renders the header title', () => {
  const { container } = render(
    <MemoryRouter>
      <ThemeContext.Provider value={{ darkMode: false, toggleTheme: ()=>{} }}>
        <Header />
      </ThemeContext.Provider>
    </MemoryRouter>
  );

  expect(container.textContent).toContain('Groq AI Chat');
});

test('renders settings button', () => {
  render(
    <MemoryRouter>
      <ThemeContext.Provider value={{ darkMode: false, toggleTheme: () => {} }}>
        <Header />
      </ThemeContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByRole('button')).toBeDefined();
});

test('calls navigate when settings button is clicked', () => {
  const navigateMock = vi.fn();
  (useNavigate as unknown as Mock).mockReturnValue(navigateMock);

  render(
    <MemoryRouter>
      <ThemeContext.Provider value={{ darkMode: false, toggleTheme: () => {} }}>
        <Header />
      </ThemeContext.Provider>
    </MemoryRouter>
  );

  const settingsButton = screen.getByRole('button');
  settingsButton.click();

  expect(navigateMock).toHaveBeenCalledWith('?settings=true');
});
