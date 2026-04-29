import { useState } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { ChatbotScreen } from './components/ChatbotScreen';
import { ResourcesHub } from './components/ResourcesHub';
import { PeerForum } from './components/PeerForum';
import { BookingSystem } from './components/BookingSystem';
import { ProfileScreen } from './components/ProfileScreen';
import { AuthScreen } from './components/AuthScreen';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { user, loading } = useAuth();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard onTabChange={setActiveTab} />;
      case 'chatbot':
        return <ChatbotScreen />;
      case 'resources':
        return <ResourcesHub />;
      case 'forum':
        return <PeerForum />;
      case 'booking':
        return <BookingSystem />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeDashboard onTabChange={setActiveTab} />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">Loading...</div>;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--theme-bg-gradient)' }}>
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="pt-0">
          {renderActiveScreen()}
        </main>
      </div>
    </ThemeProvider>
  );
}