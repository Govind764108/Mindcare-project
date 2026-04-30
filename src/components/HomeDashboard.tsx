import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Calendar, Headphones, Users, ChevronLeft, ChevronRight, Lightbulb, Camera } from 'lucide-react';
import { useMoodDetection } from '../hooks/useMoodDetection';
import { useTheme, getMoodClass } from './ThemeContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeDashboardProps {
  onTabChange: (tab: string) => void;
}

/** Maps mood class name to a friendly label + emoji for the badge */
const MOOD_BADGE: Record<string, { label: string; emoji: string }> = {
  'mood-struggling': { label: 'Struggling', emoji: '😟' },
  'mood-notgood':    { label: 'Not so good', emoji: '😕' },
  'mood-okay':       { label: 'Okay', emoji: '😐' },
  'mood-good':       { label: 'Good', emoji: '🙂' },
  'mood-great':      { label: 'Great', emoji: '😊' },
};

export function HomeDashboard({ onTabChange }: HomeDashboardProps) {
  // ── Use global mood from ThemeContext so entire app re-colours ────────────
  const { moodValue: globalMood, setMoodValue: setGlobalMood } = useTheme();
  // Keep a Slider-compatible array wrapper locally
  const moodValue = [globalMood];
  const setMoodValue = (val: number[]) => setGlobalMood(val[0]);

  const [currentTip, setCurrentTip] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { mood, isDetecting, setIsDetecting, captureAndDetect } = useMoodDetection(videoRef);

  const activeMoodClass = getMoodClass(globalMood);
  const moodBadge = MOOD_BADGE[activeMoodClass];

  useEffect(() => {
    let interval: any;
    if (isDetecting) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Could not access webcam", err));

      interval = setInterval(() => {
        captureAndDetect();
      }, 3000); // Check mood every 3 seconds
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    return () => clearInterval(interval);
  }, [isDetecting, captureAndDetect]);

  useEffect(() => {
    if (mood) {
      // Map detected mood to global slider value
      const moodMap: Record<string, number> = {
        'happy': 85,
        'neutral': 50,
        'surprise': 65,
        'sad': 25,
        'angry': 10
      };
      if (moodMap[mood] !== undefined) {
        setGlobalMood(moodMap[mood]);
      }
    }
  }, [mood]);

  const getMoodEmoji = (value: number) => {
    if (value >= 80) return '😊';
    if (value >= 60) return '🙂';
    if (value >= 40) return '😐';
    if (value >= 20) return '😕';
    return '😟';
  };

  const getMoodText = (value: number) => {
    if (value >= 80) return 'Great';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Okay';
    if (value >= 20) return 'Not so good';
    return 'Struggling';
  };

  const quickAccessCards = [
    {
      title: 'Chat with AI',
      description: 'Get instant support and guidance',
      icon: MessageCircle,
      gradient: 'var(--gradient-primary)',
      action: () => onTabChange('chatbot'),
    },
    {
      title: 'Book Counsellor',
      description: 'Schedule a session with a professional',
      icon: Calendar,
      gradient: 'var(--gradient-secondary)',
      action: () => onTabChange('booking'),
    },
    {
      title: 'Relaxation Audio',
      description: 'Listen to calming sounds and music',
      icon: Headphones,
      gradient: 'var(--gradient-tertiary)',
      action: () => onTabChange('resources'),
    },
    {
      title: 'Peer Support',
      description: 'Connect with fellow students',
      icon: Users,
      gradient: 'var(--icon-quaternary)',
      action: () => onTabChange('forum'),
    },
  ];

  const wellnessTips = [
    {
      title: "Take a 5-minute breathing break",
      description: "Deep breathing can help reduce stress and anxiety instantly.",
      icon: "🫁"
    },
    {
      title: "Stay hydrated throughout the day",
      description: "Drinking water helps maintain focus and energy levels.",
      icon: "💧"
    },
    {
      title: "Practice the 20-20-20 rule",
      description: "Every 20 minutes, look at something 20 feet away for 20 seconds.",
      icon: "👀"
    },
    {
      title: "Connect with a friend today",
      description: "Social connections are vital for mental wellbeing.",
      icon: "🤝"
    },
    {
      title: "Get some natural light",
      description: "Sunlight helps regulate your circadian rhythm and mood.",
      icon: "☀️"
    },
  ];

  const mentalHealthQuotes = [
    {
      text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
      author: "A.A. Milne"
    },
    {
      text: "Progress, not perfection, is the goal. Every small step forward counts.",
      author: "Unknown"
    },
    {
      text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
      author: "Unknown"
    },
    {
      text: "It's okay to not be okay. What's not okay is staying that way and not asking for help.",
      author: "Unknown"
    },
    {
      text: "Healing isn't linear. Be patient with yourself through every phase of your journey.",
      author: "Unknown"
    },
    {
      text: "You have been assigned this mountain to show others it can be moved.",
      author: "Mel Robbins"
    },
    {
      text: "The strongest people are not those who show strength in front of us, but those who win battles we know nothing about.",
      author: "Unknown"
    },
    {
      text: "Your struggles develop your strengths. When you go through hardships and decide not to surrender, that is strength.",
      author: "Arnold Schwarzenegger"
    },
    {
      text: "Self-compassion is simply giving the same kindness to ourselves that we would give to others.",
      author: "Christopher Germer"
    },
    {
      text: "You are not your illness. You have an individual story to tell. You have a name, a history, a personality.",
      author: "Julian Seifter"
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle"
    },
    {
      text: "Take time to make your soul happy. Prioritize your peace and well-being.",
      author: "Unknown"
    },
    {
      text: "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
      author: "Christian D. Larson"
    },
    {
      text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious. Having feelings doesn't make you a negative person.",
      author: "Lori Deschene"
    },
    {
      text: "Recovery is not one and done. It is a lifelong process that takes place one day, one hour, one minute, and one breath at a time.",
      author: "Unknown"
    },
    {
      text: "You are enough exactly as you are. Your worth is not determined by your productivity or achievements.",
      author: "Unknown"
    },
    {
      text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
      author: "Noam Shpancer"
    },
    {
      text: "The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.",
      author: "William James"
    },
    {
      text: "You are allowed to be both a masterpiece and a work in progress simultaneously.",
      author: "Sophia Bush"
    },
    {
      text: "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying 'I will try again tomorrow.'",
      author: "Mary Anne Radmacher"
    },
    {
      text: "Your current situation is not your final destination. The best days are yet to come.",
      author: "Unknown"
    },
    {
      text: "Be gentle with yourself. You're doing the best you can with what you have right now.",
      author: "Unknown"
    },
    {
      text: "Sometimes the most productive thing you can do is rest and recharge.",
      author: "Unknown"
    },
    {
      text: "You are not alone in this journey. Reach out, connect, and remember that asking for help is a sign of strength.",
      author: "Unknown"
    },
    {
      text: "Every day is a new opportunity to take care of your mental health and practice self-compassion.",
      author: "Unknown"
    },
    {
      text: "Your mind is a garden. Your thoughts are the seeds. You can grow flowers or you can grow weeds.",
      author: "Unknown"
    },
    {
      text: "Embrace uncertainty. Some of the most beautiful chapters in our lives won't have a title until much later.",
      author: "Bob Goff"
    },
    {
      text: "You have survived 100% of your worst days. You're doing great!",
      author: "Unknown"
    },
    {
      text: "Small daily improvements over time lead to stunning results. Be patient with your progress.",
      author: "Robin Sharma"
    },
    {
      text: "It's okay to outgrow people who don't celebrate your growth. Surround yourself with those who support your journey.",
      author: "Unknown"
    }
  ];

  // Function to get daily quote based on current date
  const getDailyQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % mentalHealthQuotes.length;
    return mentalHealthQuotes[quoteIndex];
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % wellnessTips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + wellnessTips.length) % wellnessTips.length);
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: 'var(--theme-bg-gradient)' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-block">
            <ImageWithFallback
              src="https://img.freepik.com/free-vector/emotion-detection-abstract-concept-vector-illustration-speech-emotional-state-recognition-emotion-detection-from-text-sensor-technology-machine-learning-ai-reading-face-abstract-metaphor_335657-2305.jpg"
              alt="Wellness and meditation"
              className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
            />
          </div>
          <div className="space-y-4">
            <h1
              className="font-['Poppins'] font-semibold text-3xl md:text-4xl transition-colors duration-300"
              style={{ color: 'var(--theme-text-primary)' }}
            >
              How are you feeling today?
            </h1>

            {/* Mood Tracker */}
            <Card
              className="max-w-md mx-auto backdrop-blur-sm border-0 shadow-xl card-glow"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, var(--theme-bg) 70%, transparent), color-mix(in srgb, var(--theme-accent) 30%, transparent))`,
                transition: 'background 700ms cubic-bezier(0.4,0,0.2,1), box-shadow 700ms ease'
              }}
            >
              <CardContent className="p-6 space-y-4">
                {/* Mood palette indicator badge */}
                <div className="flex justify-center">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--theme-primary) 15%, transparent)',
                      color: 'var(--theme-primary)',
                      border: '1px solid color-mix(in srgb, var(--theme-primary) 30%, transparent)',
                      transition: 'all 700ms ease'
                    }}
                  >
                    <span>{moodBadge.emoji}</span>
                    <span>UI Palette: {moodBadge.label}</span>
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: 'var(--theme-primary)' }}
                    />
                  </span>
                </div>

                <div className="text-center">
                  <div
                    className="text-6xl mb-2 p-3 rounded-2xl inline-block"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 10%, transparent), color-mix(in srgb, var(--theme-tertiary) 15%, transparent))`,
                      transition: 'background 700ms ease'
                    }}
                  >
                    {getMoodEmoji(moodValue[0])}
                  </div>
                  <p
                    className="text-lg font-medium"
                    style={{ color: 'var(--theme-primary)', transition: 'color 700ms ease' }}
                  >
                    Feeling {getMoodText(moodValue[0])}
                  </p>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={moodValue}
                    onValueChange={setMoodValue}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm transition-colors duration-300" style={{ color: 'var(--theme-secondary)' }}>
                    <span className="text-2xl">😟</span>
                    <span className="text-2xl">😐</span>
                    <span className="text-2xl">😊</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--theme-text-primary)' }}>Auto-detect via Webcam</span>
                    <Button
                      variant={isDetecting ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setIsDetecting(!isDetecting)}
                      className="flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      {isDetecting ? 'Stop' : 'Start'}
                    </Button>
                  </div>
                  {isDetecting && (
                    <div className="mt-4 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-48 object-cover transform scale-x-[-1]"
                      />
                      <div className="text-xs text-center py-1 bg-gray-100 text-gray-500">
                        {mood ? `Detected: ${mood}` : 'Analyzing...'}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="space-y-4">
          <h2
            className="font-['Poppins'] font-semibold text-2xl text-center transition-colors duration-300"
            style={{ color: 'var(--theme-text-primary)' }}
          >
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickAccessCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card
                  key={index}
                  className="group cursor-pointer card-glow backdrop-blur-sm border-0"
                  onClick={card.action}
                  style={{ backgroundColor: 'var(--theme-card-bg)' }}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div
                      className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                      style={{
                        backgroundColor: card.gradient,
                        boxShadow: `0 4px 12px color-mix(in srgb, ${card.gradient} 40%, transparent)`
                      }}
                    >
                      <Icon className="w-8 h-8 drop-shadow-sm" style={{ color: 'var(--icon-contrast)' }} />
                    </div>
                    <div className="space-y-2">
                      <h3
                        className="font-['Poppins'] font-medium text-lg transition-colors duration-300"
                        style={{ color: 'var(--theme-text-primary)' }}
                      >
                        {card.title}
                      </h3>
                      <p
                        className="text-sm transition-colors duration-300"
                        style={{ color: 'var(--theme-text-secondary)' }}
                      >
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Daily Wellness Tips Carousel */}
        <div className="space-y-4">
          <h2
            className="font-['Poppins'] font-semibold text-2xl text-center transition-colors duration-300"
            style={{ color: 'var(--theme-text-primary)' }}
          >
            Daily Wellness Tips
          </h2>
          <div className="max-w-2xl mx-auto">
            <Card
              className="border-0 shadow-lg card-glow transition-colors duration-300"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 10%, transparent), color-mix(in srgb, var(--theme-tertiary) 10%, transparent))`
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevTip}
                    className="rounded-full w-10 h-10 p-0 theme-button-ghost interactive-glow"
                  >
                    <ChevronLeft className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                  </Button>

                  <div className="flex-1 text-center space-y-3">
                    <div className="text-3xl">{wellnessTips[currentTip].icon}</div>
                    <div className="space-y-2">
                      <h3
                        className="font-['Poppins'] font-medium text-lg transition-colors duration-300"
                        style={{ color: 'var(--theme-text-primary)' }}
                      >
                        {wellnessTips[currentTip].title}
                      </h3>
                      <p
                        className="transition-colors duration-300"
                        style={{ color: 'var(--theme-text-secondary)' }}
                      >
                        {wellnessTips[currentTip].description}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextTip}
                    className="rounded-full w-10 h-10 p-0 theme-button-ghost"
                  >
                    <ChevronRight className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                  </Button>
                </div>

                {/* Indicators */}
                <div className="flex justify-center space-x-2 mt-4">
                  {wellnessTips.map((_, index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: index === currentTip ? 'var(--theme-primary)' : '#d1d5db'
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Mental Health Quote */}
        <div className="space-y-4">
          <h2
            className="font-['Poppins'] font-semibold text-2xl text-center transition-colors duration-300"
            style={{ color: 'var(--theme-text-primary)' }}
          >
            Daily Inspiration
          </h2>
          <div className="max-w-3xl mx-auto">
            <Card
              className="border-0 shadow-lg card-glow transition-colors duration-300"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, var(--theme-secondary) 8%, transparent), color-mix(in srgb, var(--theme-accent) 15%, transparent))`
              }}
            >
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div
                    className="text-6xl mb-4 inline-block p-4 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--theme-tertiary) 15%, transparent)',
                      color: 'var(--theme-primary)'
                    }}
                  >
                    ✨
                  </div>
                  <blockquote
                    className="text-xl md:text-2xl font-medium italic leading-relaxed transition-colors duration-300"
                    style={{ color: 'var(--theme-primary)' }}
                  >
                    "{getDailyQuote().text}"
                  </blockquote>
                  <p
                    className="text-lg font-medium transition-colors duration-300 mt-4"
                    style={{ color: 'var(--theme-secondary)' }}
                  >
                    — {getDailyQuote().author}
                  </p>
                  <div className="flex items-center justify-center mt-6 space-x-2">
                    <div
                      className="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--theme-tertiary) 20%, transparent)',
                        color: 'var(--theme-primary)'
                      }}
                    >
                      Refreshes Daily
                    </div>
                    <Lightbulb
                      className="w-4 h-4 transition-colors duration-300"
                      style={{ color: 'var(--theme-secondary)' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}