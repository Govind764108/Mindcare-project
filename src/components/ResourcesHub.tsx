import { useState } from 'react';
import { Search, Play, Download, Volume2, Video, FileText } from 'lucide-react';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'pdf';
  duration?: string;
  category: string;
  thumbnail?: string;
  featured?: boolean;
  mediaUrl?: string;
}

export function ResourcesHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('stress');
  const [playingMediaId, setPlayingMediaId] = useState<string | null>(null);

  const getMediaUrl = (resource: Resource) => {
    if (resource.mediaUrl) return resource.mediaUrl;
    return resource.type === 'video' 
      ? 'https://www.w3schools.com/html/mov_bbb.mp4' 
      : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  };

  const resources: Resource[] = [
    {
      id: 'stress-yt',
      title: 'Stress Relief & Management',
      description: 'Learn how to manage stress effectively.',
      type: 'video',
      category: 'stress',
      thumbnail: 'https://img.youtube.com/vi/m3-O7gPsQK0/hqdefault.jpg',
      mediaUrl: 'https://www.youtube.com/embed/m3-O7gPsQK0?autoplay=1',
      featured: true,
    },
    {
      id: '2',
      title: 'Guided Breathing Exercise',
      description: 'A 10-minute guided breathing session to reduce anxiety and stress.',
      type: 'audio',
      duration: '10:00',
      category: 'stress',
      mediaUrl: 'https://www.youtube.com/embed/9yj8mBfHlMk?autoplay=1',
    },
    {
      id: '3',
      title: 'Stress Management Toolkit',
      description: 'Comprehensive guide with strategies and worksheets for stress management.',
      type: 'pdf',
      category: 'stress',
      mediaUrl: 'https://assets.chaminade.edu/wp-content/uploads/2022/05/13122028/Stress-Management-Toolkit.pdf',
    },
    {
      id: 'sleep-yt',
      title: 'Deep Sleep & Relaxation',
      description: 'Improve your sleep quality.',
      type: 'video',
      category: 'sleep',
      thumbnail: 'https://img.youtube.com/vi/7kTQSMlpFUA/hqdefault.jpg',
      mediaUrl: 'https://www.youtube.com/embed/7kTQSMlpFUA?autoplay=1',
      featured: true,
    },
    {
      id: '5',
      title: 'Bedtime Meditation',
      description: 'Relaxing meditation to help you unwind and prepare for restful sleep.',
      type: 'audio',
      duration: '15:00',
      category: 'sleep',
      mediaUrl: 'https://www.youtube.com/embed/SjSuAfdoDo4?autoplay=1',
    },
    {
      id: '6',
      title: 'Sleep Schedule Planner',
      description: 'Downloadable template to track and optimize your sleep patterns.',
      type: 'pdf',
      category: 'sleep',
      mediaUrl: 'https://www.solentmind.org.uk/assets/uploads/resources/Sleep%20Toolkit.pdf',
    },
    {
      id: 'exam-yt',
      title: 'Exam Preparation & Focus',
      description: 'Stay focused and ace your exams.',
      type: 'video',
      category: 'exam',
      thumbnail: 'https://img.youtube.com/vi/Ni3VEgbvuhU/hqdefault.jpg',
      mediaUrl: 'https://www.youtube.com/embed/Ni3VEgbvuhU?autoplay=1',
      featured: true,
    },
    {
      id: '8',
      title: 'Focus Sounds for Studying',
      description: 'Background sounds and music to enhance concentration during study sessions.',
      type: 'audio',
      duration: '60:00',
      category: 'exam',
      mediaUrl: 'https://www.youtube.com/embed/4zsl1Bep1as?autoplay=1',
    },
    {
      id: '9',
      title: 'Exam Success Workbook',
      description: 'Complete guide with study schedules, techniques, and anxiety management.',
      type: 'pdf',
      category: 'exam',
      mediaUrl: 'https://www.kirkleeslocaloffer.org.uk/media/qtllv3i4/barnardo-s-exam-stress-toolkit.pdf',
    },
    {
      id: 'rel-yt',
      title: 'Building Healthy Relationships',
      description: 'Understand and build better relationships.',
      type: 'video',
      category: 'relationships',
      thumbnail: 'https://img.youtube.com/vi/DYBRWLeY5VY/hqdefault.jpg',
      mediaUrl: 'https://www.youtube.com/embed/DYBRWLeY5VY?autoplay=1',
      featured: true,
    },
    {
      id: '11',
      title: 'Communication Skills Audio Course',
      description: 'Improve your communication skills for better relationships.',
      type: 'audio',
      duration: '25:30',
      category: 'relationships',
      mediaUrl: 'https://www.youtube.com/embed/dCBB8h3HmVU?autoplay=1',
    },
    {
      id: '12',
      title: 'Relationship Wellness Guide',
      description: 'Tips and exercises for maintaining emotional wellness in relationships.',
      type: 'pdf',
      category: 'relationships',
      mediaUrl: 'https://healthyrelationshipsinitiative.org/wp-content/uploads/2025/08/HRI-Healthy-Relationships-at-Work-Toolkit.pdf',
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = resource.category === activeTab;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Volume2;
      case 'pdf': return FileText;
      default: return FileText;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'video': return 'from-[#6C63FF] to-[#A7D8FF]';
      case 'audio': return 'from-[#00BFA6] to-[#A7D8FF]';
      case 'pdf': return 'from-[#E8F5E8] to-[#00BFA6]';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: 'var(--theme-bg-gradient)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 
            className="font-['Poppins'] font-semibold text-3xl md:text-4xl transition-colors duration-300"
            style={{ color: 'var(--theme-text-primary)' }}
          >
            Resources Hub
          </h1>
          <p 
            className="max-w-2xl mx-auto transition-colors duration-300"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            Access a comprehensive collection of videos, audio guides, and resources 
            to support your mental health and wellbeing journey.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300" 
              style={{ color: 'var(--theme-text-secondary)' }}
            />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 rounded-full transition-colors duration-300"
              style={{ 
                backgroundColor: 'var(--theme-card-bg)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text-primary)'
              }}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList 
            className="grid w-full grid-cols-4 max-w-2xl mx-auto backdrop-blur-sm transition-colors duration-300"
            style={{ backgroundColor: 'var(--theme-card-bg)' }}
          >
            <TabsTrigger 
              value="stress" 
              className="transition-colors duration-300 font-medium"
              style={{ 
                '--data-state-active-bg': 'var(--theme-primary)',
                backgroundColor: activeTab === 'stress' ? 'var(--theme-primary)' : 'var(--tab-bg-inactive)',
                color: activeTab === 'stress' ? 'var(--tab-text-active)' : 'var(--tab-text-inactive)'
              }}
            >
              Stress
            </TabsTrigger>
            <TabsTrigger 
              value="sleep" 
              className="transition-colors duration-300 font-medium"
              style={{ 
                '--data-state-active-bg': 'var(--theme-primary)',
                backgroundColor: activeTab === 'sleep' ? 'var(--theme-primary)' : 'var(--tab-bg-inactive)',
                color: activeTab === 'sleep' ? 'var(--tab-text-active)' : 'var(--tab-text-inactive)'
              }}
            >
              Sleep
            </TabsTrigger>
            <TabsTrigger 
              value="exam" 
              className="transition-colors duration-300 font-medium"
              style={{ 
                '--data-state-active-bg': 'var(--theme-primary)',
                backgroundColor: activeTab === 'exam' ? 'var(--theme-primary)' : 'var(--tab-bg-inactive)',
                color: activeTab === 'exam' ? 'var(--tab-text-active)' : 'var(--tab-text-inactive)'
              }}
            >
              Exam
            </TabsTrigger>
            <TabsTrigger 
              value="relationships" 
              className="transition-colors duration-300 font-medium"
              style={{ 
                '--data-state-active-bg': 'var(--theme-primary)',
                backgroundColor: activeTab === 'relationships' ? 'var(--theme-primary)' : 'var(--tab-bg-inactive)',
                color: activeTab === 'relationships' ? 'var(--tab-text-active)' : 'var(--tab-text-inactive)'
              }}
            >
              Relationships
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {/* Featured Resources */}
            {filteredResources.some(r => r.featured) && (
              <div className="mb-8">
                <h2 
                  className="font-['Poppins'] font-semibold text-xl mb-4 transition-colors duration-300"
                  style={{ color: 'var(--theme-text-primary)' }}
                >
                  Featured Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.filter(r => r.featured).map((resource) => {
                    const Icon = getResourceIcon(resource.type);
                    return (
                      <Card 
                        key={resource.id} 
                        className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm border-0 overflow-hidden"
                        style={{ backgroundColor: 'var(--theme-card-bg)' }}
                      >
                        {resource.thumbnail && (
                          <div className="relative h-48 overflow-hidden">
                            {playingMediaId === resource.id ? (
                              resource.type === 'video' ? (
                                getMediaUrl(resource).includes('youtube.com') ? (
                                  <iframe src={getMediaUrl(resource)} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                ) : (
                                  <video src={getMediaUrl(resource)} controls autoPlay className="w-full h-full object-cover bg-black" />
                                )
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-4">
                                  {getMediaUrl(resource).includes('youtube.com') ? (
                                    <iframe src={getMediaUrl(resource)} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                  ) : (
                                    <audio src={getMediaUrl(resource)} controls autoPlay className="w-full" />
                                  )}
                                </div>
                              )
                            ) : (
                              <>
                                <ImageWithFallback
                                  src={resource.thumbnail}
                                  alt={resource.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                                <div className="absolute top-4 left-4">
                                  <Badge className={`bg-gradient-to-r ${getResourceColor(resource.type)} text-white border-0`}>
                                    <Icon className="w-3 h-3 mr-1" />
                                    {resource.type.toUpperCase()}
                                  </Badge>
                                </div>
                                {resource.duration && (
                                  <div className="absolute bottom-4 right-4">
                                    <Badge variant="secondary" className="bg-black/50 text-white border-0">
                                      {resource.duration}
                                    </Badge>
                                  </div>
                                )}
                                <Button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    if (resource.type === 'pdf') {
                                      window.open(getMediaUrl(resource), '_blank');
                                    } else {
                                      setPlayingMediaId(resource.id); 
                                    }
                                  }}
                                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-16 h-16 bg-white/90 hover:bg-white text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                  <Play className="w-6 h-6 ml-1" />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle 
                              className="font-['Poppins'] text-lg line-clamp-2 transition-colors duration-300"
                              style={{ color: 'var(--theme-text-primary)' }}
                            >
                              {resource.title}
                            </CardTitle>
                            {!resource.thumbnail && (
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2 shadow-lg"
                                style={{ 
                                  backgroundColor: resource.type === 'audio' ? 'var(--theme-secondary)' : 
                                                 resource.type === 'video' ? 'var(--theme-primary)' : 'var(--theme-tertiary)'
                                }}
                              >
                                <Icon className="w-5 h-5 drop-shadow-sm" style={{ color: 'var(--icon-primary)' }} />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--theme-text-secondary)' }}>
                            {resource.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                if (resource.type === 'pdf') {
                                  window.open(getMediaUrl(resource), '_blank');
                                } else {
                                  setPlayingMediaId(resource.id); 
                                }
                              }}
                              size="sm" 
                              className="bg-[#6C63FF] hover:bg-[#5b54d9] text-white"
                            >
                              {resource.type === 'pdf' ? (
                                <>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  {resource.type === 'video' ? 'Watch' : 'Listen'}
                                </>
                              )}
                            </Button>
                            {resource.duration && (
                              <span className="text-sm text-gray-500">{resource.duration}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Resources */}
            <div>
              <h2 
                className="font-['Poppins'] font-semibold text-xl mb-4 transition-colors duration-300"
                style={{ color: 'var(--theme-text-primary)' }}
              >
                All Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.filter(r => !r.featured).map((resource) => {
                  const Icon = getResourceIcon(resource.type);
                  return (
                    <Card 
                      key={resource.id} 
                      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm border-0"
                      style={{ backgroundColor: 'var(--theme-card-bg)' }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle 
                            className="font-['Poppins'] text-lg line-clamp-2 transition-colors duration-300"
                            style={{ color: 'var(--theme-text-primary)' }}
                          >
                            {resource.title}
                          </CardTitle>
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2 shadow-lg"
                            style={{ 
                              backgroundColor: resource.type === 'audio' ? 'var(--theme-secondary)' : 
                                             resource.type === 'video' ? 'var(--theme-primary)' : 'var(--theme-tertiary)'
                            }}
                          >
                            <Icon className="w-5 h-5 drop-shadow-sm" style={{ color: 'var(--icon-primary)' }} />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {resource.description}
                        </p>
                        {playingMediaId === resource.id ? (
                          <div className="mt-4">
                            {resource.type === 'video' ? (
                              getMediaUrl(resource).includes('youtube.com') ? (
                                <div className="relative w-full pt-[56.25%]">
                                  <iframe src={getMediaUrl(resource)} className="absolute top-0 left-0 w-full h-full rounded-md" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                </div>
                              ) : (
                                <video src={getMediaUrl(resource)} controls autoPlay className="w-full rounded-md bg-black" />
                              )
                            ) : (
                              getMediaUrl(resource).includes('youtube.com') ? (
                                <div className="relative w-full pt-[56.25%]">
                                  <iframe src={getMediaUrl(resource)} className="absolute top-0 left-0 w-full h-full rounded-md" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                </div>
                              ) : (
                                <audio src={getMediaUrl(resource)} controls autoPlay className="w-full" />
                              )
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <Button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                if (resource.type === 'pdf') {
                                  window.open(getMediaUrl(resource), '_blank');
                                } else {
                                  setPlayingMediaId(resource.id); 
                                }
                              }}
                              size="sm" 
                              className="bg-[#6C63FF] hover:bg-[#5b54d9] text-white"
                            >
                              {resource.type === 'pdf' ? (
                                <>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  {resource.type === 'video' ? 'Watch' : 'Listen'}
                                </>
                              )}
                            </Button>
                            {resource.duration && (
                              <span className="text-sm text-gray-500">{resource.duration}</span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="font-['Poppins'] font-medium text-xl text-gray-600 mb-2">
              No resources found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or browse a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}