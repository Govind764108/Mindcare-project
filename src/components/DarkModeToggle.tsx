import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeContext';

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleDarkMode}
      className="h-9 w-9 px-0 theme-button-ghost"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
      ) : (
        <Moon className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
      )}
    </Button>
  );
}