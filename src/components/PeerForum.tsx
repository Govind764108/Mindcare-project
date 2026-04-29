import { useState } from 'react';
import { Heart, Flower, HandHeart, Plus, MessageCircle, Clock, Star, X } from 'lucide-react';
import { useForum, ForumThread } from '../hooks/useForum';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  category: string;
  reactions: {
    heart: number;
    flower: number;
    handshake: number;
  };
  replies: number;
  isAnonymous?: boolean;
}

interface Helper {
  id: string;
  name: string;
  avatar: string;
  badge: string;
  helpCount: number;
  isOnline: boolean;
}

export function PeerForum() {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('general');

  const categories = [
    { id: 'general', label: 'General', icon: MessageCircle, count: 24 },
    { id: 'exam-stress', label: 'Exam Stress', icon: Clock, count: 18 },
    { id: 'sleep-issues', label: 'Sleep Issues', icon: Heart, count: 12 },
    { id: 'anonymous-vent', label: 'Anonymous Vent', icon: HandHeart, count: 31 },
  ];

  const initialPosts: ForumThread[] = [
    {
      id: '1',
      title: 'Feeling overwhelmed with midterm season',
      content: 'Hey everyone, I\'m really struggling with the pressure of upcoming midterms. I feel like I\'m behind on everything and don\'t know where to start. Anyone else feeling this way?',
      authorId: 'user1',
      authorName: 'Priya S.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category: 'exam-stress',
      likes: 15,
      replies: 7,
    },
    {
      id: '2',
      title: 'Anyone have tips for better sleep schedule?',
      content: 'I\'ve been staying up way too late and my sleep schedule is completely messed up. It\'s affecting my mood and concentration. What works for you?',
      authorId: 'anon',
      authorName: 'Anonymous',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      category: 'sleep-issues',
      likes: 22,
      replies: 12,
      isAnonymous: true,
    },
    {
      id: '3',
      title: 'Just wanted to share something positive',
      content: 'Had a really tough week but finally finished my project! Remember that every small step counts. You\'ve got this! 💪',
      authorId: 'user3',
      authorName: 'Rahul Gupta',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      category: 'general',
      likes: 45,
      replies: 15,
    },
  ] as any;

  const { threads: posts, loading, likeThread, createThread } = useForum(initialPosts);

  const topHelpers: Helper[] = [
    {
      id: '1',
      name: 'Arjun Mehta',
      avatar: '',
      badge: 'Peer Mentor',
      helpCount: 45,
      isOnline: true,
    },
    {
      id: '2',
      name: 'Ananya Rao',
      avatar: '',
      badge: 'Study Buddy',
      helpCount: 32,
      isOnline: true,
    },
    {
      id: '3',
      name: 'Ravi Kumar',
      avatar: '',
      badge: 'Wellness Champion',
      helpCount: 28,
      isOnline: false,
    },
    {
      id: '4',
      name: 'Kavya Sharma',
      avatar: '',
      badge: 'Sleep Coach',
      helpCount: 24,
      isOnline: true,
    },
    {
      id: '5',
      name: 'Vikram Singh',
      avatar: '',
      badge: 'Mindfulness Guide',
      helpCount: 19,
      isOnline: false,
    },
  ];

  const filteredPosts = posts.filter((post: any) => 
    selectedCategory === 'general' || post.category === selectedCategory
  );

  const formatTimeAgo = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--theme-bg-gradient)' }}>
      <div className="max-w-7xl mx-auto flex h-screen">
        {/* Left Sidebar - Categories */}
        <div className="w-64 backdrop-blur-sm p-4 transition-colors duration-300" style={{ backgroundColor: 'var(--theme-card-bg)', borderRight: `1px solid var(--theme-border)` }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-['Poppins'] font-semibold text-lg transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                Categories
              </h2>
              <Button size="sm" className="bg-[#6C63FF] hover:bg-[#5b54d9] text-white rounded-full w-8 h-8 p-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#6C63FF] text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#6C63FF]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{category.label}</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      } text-xs`}
                    >
                      {category.count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content - Posts Feed */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-['Poppins'] font-semibold text-2xl transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                  Peer Support Forum
                </h1>
                <p className="transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
                  Connect, share, and support each other in your wellness journey
                </p>
              </div>
              <Button onClick={() => setShowNewPost(true)} className="bg-[#00BFA6] hover:bg-[#00a693] text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200" style={{ backgroundColor: 'var(--theme-card-bg)' }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-r from-[#6C63FF] to-[#A7D8FF] text-white">
                              {(post as any).isAnonymous ? '?' : ((post as any).authorName || 'U').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-['Poppins'] font-medium transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                                {(post as any).isAnonymous ? 'Anonymous' : post.authorName}
                              </h3>
                              {(post as any).isAnonymous && (
                                <Badge variant="outline" className="text-xs">
                                  Anonymous
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
                              {formatTimeAgo(post.createdAt || (post as any).timestamp)}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-[#E8F5E8] text-[#00BFA6] border-0">
                          {categories.find(c => c.id === post.category)?.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <h2 className="font-['Poppins'] font-medium text-lg mb-2 transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                        {post.title}
                      </h2>
                      <p className="mb-4 leading-relaxed transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button onClick={() => likeThread(post.id)} className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-200">
                            <Heart className="w-5 h-5" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-pink-500 transition-colors duration-200">
                            <Flower className="w-5 h-5" />
                            <span className="text-sm">{(post as any).reactions?.flower || 0}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                            <HandHeart className="w-5 h-5" />
                            <span className="text-sm">{(post as any).reactions?.handshake || 0}</span>
                          </button>
                        </div>
                        
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-[#6C63FF] transition-colors duration-200">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.replies} replies</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Right Sidebar - Top Helpers */}
        <div className="w-80 backdrop-blur-sm p-4 transition-colors duration-300" style={{ backgroundColor: 'var(--theme-card-bg)', borderLeft: `1px solid var(--theme-border)` }}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="font-['Poppins'] font-semibold text-lg transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                Top Helpers
              </h2>
            </div>
            
            <div className="space-y-3">
              {topHelpers.map((helper, index) => (
                <Card key={helper.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200" style={{ backgroundColor: 'var(--card-bg-elevated)' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-[#6C63FF] to-[#A7D8FF] text-white font-medium">
                            {helper.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {helper.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                            {helper.name}
                          </p>
                          <span className="text-lg font-bold text-[#6C63FF]">
                            #{index + 1}
                          </span>
                        </div>
                        <Badge className="bg-[#E8F5E8] text-[#00BFA6] border-0 text-xs">
                          {helper.badge}
                        </Badge>
                        <p className="text-sm mt-1 transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
                          {helper.helpCount} people helped
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-white shadow-2xl border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <h2 className="font-['Poppins'] font-semibold text-xl">Create New Post</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowNewPost(false)} className="w-8 h-8 p-0 rounded-full hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="What's on your mind?" 
                  className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select 
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-all"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Content</label>
                <textarea 
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Share your thoughts..." 
                  className="w-full p-2.5 border border-gray-200 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-all"
                />
              </div>
              <Button 
                onClick={() => {
                  if (newTitle.trim() && newContent.trim()) {
                    createThread(newTitle, newContent, newCategory, 'user', 'Current User');
                    setShowNewPost(false);
                    setNewTitle('');
                    setNewContent('');
                  }
                }}
                className="w-full py-2.5 mt-2 bg-[#6C63FF] hover:bg-[#5b54d9] text-white"
              >
                Post
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}