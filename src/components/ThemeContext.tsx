import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'default' | 'mint' | 'ocean' | 'sakura' | 'cloud';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>('default');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load theme and dark mode preference from localStorage on mount
    const savedTheme = localStorage.getItem('mindcare-theme') as ThemeMode;
    const savedDarkMode = localStorage.getItem('mindcare-dark-mode') === 'true';
    
    if (savedTheme && ['default', 'mint', 'ocean', 'sakura', 'cloud'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
    setIsDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    // Save theme to localStorage and apply to document
    localStorage.setItem('mindcare-theme', theme);
    
    // Remove all theme classes
    document.documentElement.classList.remove('theme-default', 'theme-mint', 'theme-ocean', 'theme-sakura', 'theme-cloud');
    
    // Add current theme class
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    // Save dark mode preference and apply to document
    localStorage.setItem('mindcare-dark-mode', isDarkMode.toString());
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}