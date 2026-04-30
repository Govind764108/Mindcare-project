import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'default' | 'mint' | 'ocean' | 'sakura' | 'cloud';
export type MoodClass = 'mood-struggling' | 'mood-notgood' | 'mood-okay' | 'mood-good' | 'mood-great';

const ALL_MOOD_CLASSES: MoodClass[] = [
  'mood-struggling',
  'mood-notgood',
  'mood-okay',
  'mood-good',
  'mood-great',
];

/** Maps a 0–100 slider value to a CSS mood class */
export function getMoodClass(value: number): MoodClass {
  if (value < 20) return 'mood-struggling';
  if (value < 40) return 'mood-notgood';
  if (value < 60) return 'mood-okay';
  if (value < 80) return 'mood-good';
  return 'mood-great';
}

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  /** Global mood slider value (0–100). Drives the whole-app color palette. */
  moodValue: number;
  setMoodValue: (value: number) => void;
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
  const [moodValue, setMoodValue] = useState(50); // default: Okay

  // ── Load preferences from localStorage on mount ──────────────────────────
  useEffect(() => {
    const savedTheme = localStorage.getItem('mindcare-theme') as ThemeMode;
    const savedDarkMode = localStorage.getItem('mindcare-dark-mode') === 'true';
    const savedMood = localStorage.getItem('mindcare-mood');

    if (savedTheme && ['default', 'mint', 'ocean', 'sakura', 'cloud'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
    setIsDarkMode(savedDarkMode);
    if (savedMood !== null) setMoodValue(Number(savedMood));
  }, []);

  // ── Apply colour-theme class ──────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('mindcare-theme', theme);
    document.documentElement.classList.remove('theme-default', 'theme-mint', 'theme-ocean', 'theme-sakura', 'theme-cloud');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  // ── Apply dark-mode class ─────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('mindcare-dark-mode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // ── Apply mood class globally to <html> ───────────────────────────────────
  useEffect(() => {
    localStorage.setItem('mindcare-mood', String(moodValue));
    const moodClass = getMoodClass(moodValue);
    // Remove all existing mood classes, then add the correct one
    document.documentElement.classList.remove(...ALL_MOOD_CLASSES);
    document.documentElement.classList.add(moodClass);
  }, [moodValue]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, toggleDarkMode, moodValue, setMoodValue }}>
      {children}
    </ThemeContext.Provider>
  );
}