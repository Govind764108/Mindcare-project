import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useChatbot } from '../hooks/useChatbot';

export function ChatbotScreen() {
  const { messages, sendMessage: sendBotMessage, isLoading: isTyping } = useChatbot();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message if empty
  useEffect(() => {
    // We could initialize this in the hook or here
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue;
    setInputValue('');
    await sendBotMessage(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--theme-bg-gradient)' }}>
      {/* Header */}
      <div
        className="backdrop-blur-sm border-b p-4 transition-colors duration-300"
        style={{
          backgroundColor: 'var(--theme-card-bg)',
          borderColor: 'var(--theme-border)'
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Bot className="w-6 h-6" style={{ color: 'var(--icon-contrast)' }} />
          </div>
          <div>
            <h1 className="font-['Poppins'] font-semibold text-xl transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
              AI Support Assistant
            </h1>
            <p className="text-sm transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>Here to listen and support you 24/7</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs md:max-w-md lg:max-w-lg ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: message.sender === 'user'
                          ? 'var(--theme-primary)'
                          : 'var(--gradient-secondary)'
                      }}
                    >
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" style={{ color: 'var(--icon-contrast)' }} />
                      ) : (
                        <Bot className="w-4 h-4" style={{ color: 'var(--icon-contrast)' }} />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`p-3 rounded-2xl shadow-sm transition-colors duration-300 ${message.sender === 'user'
                        ? 'text-white rounded-br-md'
                        : 'rounded-bl-md border'
                        }`}
                      style={message.sender === 'user' ? {
                        background: 'var(--theme-primary)'
                      } : {
                        backgroundColor: 'var(--theme-card-bg)',
                        color: 'var(--theme-text-primary)',
                        borderColor: 'var(--theme-border)'
                      }}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className="text-xs mt-1 transition-colors duration-300" style={{
                        color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--theme-text-secondary)'
                      }}>
                        {new Date(message.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-xs">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--gradient-secondary)' }}
                    >
                      <Bot className="w-4 h-4" style={{ color: 'var(--icon-contrast)' }} />
                    </div>
                    <div
                      className="p-3 rounded-2xl rounded-bl-md border shadow-sm transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--theme-card-bg)',
                        borderColor: 'var(--theme-border)'
                      }}
                    >
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-text-secondary)' }}></div>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-text-secondary)', animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-text-secondary)', animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div
        className="backdrop-blur-sm border-t p-4 transition-colors duration-300"
        style={{
          backgroundColor: 'var(--theme-card-bg)',
          borderColor: 'var(--theme-border)'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your thoughts..."
                className="pr-12 py-3 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: 'var(--theme-bg-primary)',
                  color: 'var(--theme-text-primary)',
                  borderColor: 'var(--theme-border)',
                  '--tw-ring-color': 'color-mix(in srgb, var(--theme-primary) 20%, transparent)'
                } as any}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 rounded-full w-8 h-8 p-0"
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className="rounded-full w-12 h-12 p-0 disabled:opacity-50 text-white"
              style={{
                background: 'var(--theme-primary)',
                '--tw-bg-opacity': '1'
              } as any}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs mt-2 text-center transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
            This AI assistant is here to provide emotional support. For emergencies, please contact your local crisis helpline.
          </p>
        </div>
      </div>
    </div>
  );
}