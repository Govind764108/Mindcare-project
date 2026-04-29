import { useState } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useTheme, ThemeMode } from './ThemeContext';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: 'default' as ThemeMode,
      name: 'Default',
      description: 'Calm pastels',
      colors: ['#6C63FF', '#00BFA6', '#A7D8FF'],
    },
    {
      id: 'mint' as ThemeMode,
      name: 'Mint Mode',
      description: 'Fresh calm',
      colors: ['#6DB193', '#FFD6A5', '#8EC5FC'],
    },
    {
      id: 'ocean' as ThemeMode,
      name: 'Ocean Mode',
      description: 'Serene breeze',
      colors: ['#5DADEC', '#4DB6AC', '#FFB347'],
    },
    {
      id: 'sakura' as ThemeMode,
      name: 'Sakura Mode',
      description: 'Gentle & supportive',
      colors: ['#F9A8D4', '#C4B5FD', '#A5F3FC'],
    },
    {
      id: 'cloud' as ThemeMode,
      name: 'Cloud & Stone',
      description: 'Professional calm',
      colors: ['#AEC6CF', '#CFCFC4', '#F5B895'],
    },
  ];

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 theme-button-ghost"
        >
          <Palette className="w-4 h-4 mr-2" style={{ color: 'var(--theme-primary)' }} />
          <span className="hidden sm:inline">{currentTheme.name}</span>
          <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 backdrop-blur-sm transition-colors duration-300"
        style={{ 
          backgroundColor: 'var(--theme-card-bg)', 
          border: `1px solid var(--theme-border)` 
        }}
      >
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
            className={`cursor-pointer transition-all duration-200 theme-dropdown-item ${
              theme === themeOption.id ? 'active' : ''
            }`}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="flex space-x-1">
                {themeOption.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex-1">
                <div 
                  className="font-medium text-sm transition-colors duration-300"
                  style={{ color: 'var(--theme-text-primary)' }}
                >
                  {themeOption.name}
                </div>
                <div 
                  className="text-xs transition-colors duration-300"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  {themeOption.description}
                </div>
              </div>
              {theme === themeOption.id && (
                <div 
                  className="w-2 h-2 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                ></div>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}