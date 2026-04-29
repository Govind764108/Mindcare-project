import { Heart, MessageCircle, BookOpen, Users, Calendar, User } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeSwitcher } from './ThemeSwitcher';
import { DarkModeToggle } from './DarkModeToggle';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'chatbot', label: 'Chatbot', icon: MessageCircle },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'forum', label: 'Peer Forum', icon: Users },
    { id: 'booking', label: 'Booking', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav 
      className="backdrop-blur-sm shadow-sm transition-colors duration-300 nav-glow" 
      style={{ 
        backgroundColor: 'var(--theme-card-bg)',
        borderBottom: `1px solid var(--theme-border)`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 icon-glow"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <Heart className="w-5 h-5" style={{ color: 'var(--icon-contrast)' }} />
            </div>
            <span 
              className="font-['Poppins'] font-semibold text-xl transition-colors duration-300"
              style={{ color: 'var(--theme-text-primary)' }}
            >
              MindCare Portal
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 nav-glow ${
                    isActive ? 'theme-button-active' : 'theme-button-ghost'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Theme Switcher, Dark Mode Toggle and Profile */}
          <div className="flex items-center space-x-2">
            <DarkModeToggle />
            <div 
              className="hidden md:block w-px h-6 transition-colors duration-300" 
              style={{ backgroundColor: 'var(--theme-border)' }}
            ></div>
            <ThemeSwitcher />
            <div 
              className="hidden md:block w-px h-6 transition-colors duration-300" 
              style={{ backgroundColor: 'var(--theme-border)' }}
            ></div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onTabChange('profile')}
              className="theme-button-ghost interactive-glow"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className="md:hidden transition-colors duration-300" 
        style={{ borderTop: `1px solid var(--theme-border)` }}
      >
        <div className="grid grid-cols-6 gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 interactive-glow ${
                  isActive ? 'theme-button-active' : 'theme-button-ghost'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}