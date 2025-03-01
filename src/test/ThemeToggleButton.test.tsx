import { render } from 'vitest-browser-react';
import { expect, test, vi } from 'vitest';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { ThemeContext } from '../context/ThemeContext';
import { MemoryRouter } from 'react-router-dom';

test('renders LightMode icon when dark mode is enabled', () => {
  const { container } = render(
    <MemoryRouter>
      <ThemeContext.Provider value={{ darkMode: true, toggleTheme: vi.fn() }}>
        <ThemeToggleButton />
      </ThemeContext.Provider>
    </MemoryRouter>
  );

  expect(container.querySelector('svg[data-testid="LightModeIcon"]')).toBeDefined();
});

test('renders DarkMode icon when dark mode is disabled', () => {
  const { container } = render(
    <MemoryRouter>
      <ThemeContext.Provider value={{ darkMode: false, toggleTheme: vi.fn() }}>
        <ThemeToggleButton />
      </ThemeContext.Provider>
    </MemoryRouter>
  );

  expect(container.querySelector('svg[data-testid="DarkModeIcon"]')).toBeDefined();
});

test('calls toggleTheme when clicked', () => {
  const toggleThemeMock = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <ThemeContext.Provider value={{ darkMode: false, toggleTheme: toggleThemeMock }}>
        <ThemeToggleButton />
      </ThemeContext.Provider>
    </MemoryRouter>
  );

  const button = container.querySelector('button');
  button?.click();

  expect(toggleThemeMock).toHaveBeenCalledTimes(1);
});
