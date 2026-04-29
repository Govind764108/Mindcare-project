import { useState } from 'react';
import { User, Settings, Bell, Shield, Heart, Calendar, MessageCircle, BookOpen, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from './ThemeContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';


export function ProfileScreen() {
  const { profile, user, logout, updateUserProfile, changeUserPassword } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditProfile = async () => {
    if (!editName.trim()) return;
    setIsUpdating(true);
    try {
      await updateUserProfile(editName);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword.trim()) return;
    setIsUpdating(true);
    try {
      await changeUserPassword(newPassword);
      toast.success('Password updated successfully!');
      setNewPassword('');
    } catch (err: any) {
      if (err.message.includes('requires-recent-login')) {
        toast.error('For security reasons, please log out and log back in to change your password.');
      } else {
        toast.error(err.message || 'Failed to update password');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const email = profile?.email || user?.email || 'Anonymous';

  let fallbackName = 'Guest User';
  if (email && email !== 'Anonymous' && email !== 'guest@example.com') {
    fallbackName = email.split('@')[0];
    fallbackName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
  }

  const displayName = profile?.displayName || user?.displayName || fallbackName;
  const initials = displayName !== 'Guest User' ? displayName.substring(0, 2).toUpperCase() : 'ME';

  const profileStats = [
    { label: 'Sessions Attended', value: 12, icon: Calendar, color: 'var(--icon-primary)' },
    { label: 'Forum Posts', value: 8, icon: MessageCircle, color: 'var(--icon-secondary)' },
    { label: 'Resources Used', value: 24, icon: BookOpen, color: 'var(--icon-tertiary)' },
    { label: 'Wellness Streak', value: 15, icon: Heart, color: 'var(--icon-quaternary)' },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'session',
      title: 'Completed session with Dr. Priya Sharma',
      date: 'Apr 10, 2026',
      icon: Calendar,
    },
    {
      id: '2',
      type: 'forum',
      title: 'Posted in Exam Stress discussion',
      date: 'Mar 8, 2026',
      icon: MessageCircle,
    },
    {
      id: '3',
      type: 'resource',
      title: 'Watched "Managing Academic Stress" video',
      date: 'Apr 7, 2026',
      icon: BookOpen,
    },
    {
      id: '4',
      type: 'mood',
      title: 'Logged daily mood check-in',
      date: 'Mar 9, 2026',
      icon: Heart,
    },
  ];

  const achievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Completed your first counseling session',
      earned: true,
      date: 'Feb 2, 2026',
    },
    {
      id: '2',
      title: 'Community Helper',
      description: 'Helped 5 peers in the forum',
      earned: true,
      date: 'Mar 3, 2026',
    },
    {
      id: '3',
      title: 'Wellness Warrior',
      description: 'Maintained mood tracking for 30 days',
      earned: false,
      progress: 15,
      total: 30,
    },
    {
      id: '4',
      title: 'Resource Explorer',
      description: 'Used 50 different wellness resources',
      earned: false,
      progress: 24,
      total: 50,
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: 'var(--theme-bg-gradient)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarFallback
              className="text-white text-2xl transition-colors duration-300"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1
              className="font-['Poppins'] font-semibold text-3xl transition-colors duration-300"
              style={{ color: 'var(--theme-text-primary)' }}
            >
              {displayName}
            </h1>
            <p
              className="transition-colors duration-300"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              <span className="text-sm">Logged in as: {email}</span>
            </p>
            <Badge
              className="mt-2 border-0 transition-colors duration-300"
              style={{
                backgroundColor: 'var(--theme-accent)',
                color: 'var(--theme-secondary)'
              }}
            >
              {profile?.createdAt ? `Member since ${new Date(profile.createdAt.toDate ? profile.createdAt.toDate() : profile.createdAt).toLocaleDateString()}` : 'New Member'}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList
            className="grid w-full grid-cols-3 max-w-md mx-auto backdrop-blur-sm transition-colors duration-300"
            style={{ backgroundColor: 'var(--card-bg-elevated)', border: `1px solid var(--theme-border)` }}
          >
            <TabsTrigger
              value="overview"
              className="transition-colors duration-300 font-medium data-[state=active]:text-white"
              style={{
                backgroundColor: 'var(--tab-bg-inactive)',
                color: 'var(--tab-text-inactive)',
                '--tw-data-state-active-bg': 'var(--theme-primary)',
                '--tw-data-state-active-color': 'white'
              }}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="transition-colors duration-300 font-medium data-[state=active]:text-white"
              style={{
                backgroundColor: 'var(--tab-bg-inactive)',
                color: 'var(--tab-text-inactive)',
                '--tw-data-state-active-bg': 'var(--theme-primary)',
                '--tw-data-state-active-color': 'white'
              }}
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="transition-colors duration-300 font-medium data-[state=active]:text-white"
              style={{
                backgroundColor: 'var(--tab-bg-inactive)',
                color: 'var(--tab-text-inactive)',
                '--tw-data-state-active-bg': 'var(--theme-primary)',
                '--tw-data-state-active-color': 'white'
              }}
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Profile Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {profileStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={index}
                    className="backdrop-blur-sm border-0 shadow-lg transition-colors duration-300"
                    style={{ backgroundColor: 'var(--theme-card-bg)' }}
                  >
                    <CardContent className="p-6 text-center space-y-3">
                      <div
                        className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-colors duration-300"
                        style={{ backgroundColor: stat.color }}
                      >
                        <Icon className="w-6 h-6" style={{ color: 'var(--theme-bg)' }} />
                      </div>
                      <div>
                        <div
                          className="text-2xl font-bold transition-colors duration-300"
                          style={{ color: 'var(--theme-text-primary)' }}
                        >
                          {stat.value}
                        </div>
                        <div
                          className="text-sm transition-colors duration-300"
                          style={{ color: 'var(--theme-text-secondary)' }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Achievements */}
            <Card
              className="backdrop-blur-sm border-0 shadow-lg transition-colors duration-300"
              style={{ backgroundColor: 'var(--theme-card-bg)' }}
            >
              <CardHeader>
                <CardTitle
                  className="font-['Poppins'] text-xl transition-colors duration-300"
                  style={{ color: 'var(--theme-text-primary)' }}
                >
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg border-2 transition-colors duration-300"
                      style={{
                        borderColor: achievement.earned ? 'var(--icon-secondary)' : 'var(--theme-border)',
                        backgroundColor: achievement.earned
                          ? 'color-mix(in srgb, var(--icon-secondary) 15%, transparent)'
                          : 'var(--theme-hover)'
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3
                          className="font-['Poppins'] font-medium transition-colors duration-300"
                          style={{
                            color: achievement.earned ? 'var(--icon-secondary)' : 'var(--theme-text-secondary)'
                          }}
                        >
                          {achievement.title}
                        </h3>
                        {achievement.earned && (
                          <Badge
                            className="text-white border-0 text-xs transition-colors duration-300"
                            style={{ backgroundColor: 'var(--icon-secondary)' }}
                          >
                            Earned
                          </Badge>
                        )}
                      </div>
                      <p
                        className="text-sm mb-2 transition-colors duration-300"
                        style={{ color: 'var(--theme-text-secondary)' }}
                      >
                        {achievement.description}
                      </p>
                      {achievement.earned ? (
                        <p
                          className="text-xs transition-colors duration-300"
                          style={{ color: 'var(--theme-text-secondary)' }}
                        >
                          Earned on {achievement.date}
                        </p>
                      ) : (
                        <div className="space-y-1">
                          <div
                            className="flex justify-between text-xs transition-colors duration-300"
                            style={{ color: 'var(--theme-text-secondary)' }}
                          >
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.total}</span>
                          </div>
                          <div
                            className="w-full rounded-full h-2 transition-colors duration-300"
                            style={{ backgroundColor: 'var(--theme-hover)' }}
                          >
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: 'var(--icon-primary)',
                                width: `${((achievement.progress || 0) / (achievement.total || 1)) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card
              className="backdrop-blur-sm border-0 shadow-lg transition-colors duration-300"
              style={{ backgroundColor: 'var(--theme-card-bg)' }}
            >
              <CardHeader>
                <CardTitle
                  className="font-['Poppins'] text-xl transition-colors duration-300"
                  style={{ color: 'var(--theme-text-primary)' }}
                >
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    const iconColors = ['var(--icon-primary)', 'var(--icon-secondary)', 'var(--icon-tertiary)', 'var(--icon-quaternary)'];
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 rounded-lg border transition-colors duration-300"
                        style={{
                          backgroundColor: 'var(--theme-hover)',
                          borderColor: 'var(--theme-border)'
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                          style={{ backgroundColor: iconColors[index % iconColors.length] }}
                        >
                          <Icon className="w-5 h-5" style={{ color: 'var(--icon-contrast)' }} />
                        </div>
                        <div className="flex-1">
                          <h3
                            className="font-medium transition-colors duration-300"
                            style={{ color: 'var(--theme-text-primary)' }}
                          >
                            {activity.title}
                          </h3>
                          <p
                            className="text-sm transition-colors duration-300"
                            style={{ color: 'var(--theme-text-secondary)' }}
                          >
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card
              className="backdrop-blur-sm border-0 shadow-lg transition-colors duration-300"
              style={{ backgroundColor: 'var(--theme-card-bg)' }}
            >
              <CardHeader>
                <CardTitle
                  className="font-['Poppins'] text-xl transition-colors duration-300"
                  style={{ color: 'var(--theme-text-primary)' }}
                >
                  Privacy & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: 'var(--icon-primary)' }}
                    />
                    <div>
                      <h3
                        className="font-medium transition-colors duration-300"
                        style={{ color: 'var(--theme-text-primary)' }}
                      >
                        Notifications
                      </h3>
                      <p
                        className="text-sm transition-colors duration-300"
                        style={{ color: 'var(--theme-text-secondary)' }}
                      >
                        Receive wellness reminders and updates
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: 'var(--icon-secondary)' }}
                    />
                    <div>
                      <h3
                        className="font-medium transition-colors duration-300"
                        style={{ color: 'var(--theme-text-primary)' }}
                      >
                        Anonymous Mode
                      </h3>
                      <p
                        className="text-sm transition-colors duration-300"
                        style={{ color: 'var(--theme-text-secondary)' }}
                      >
                        Hide your identity in forum posts
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={anonymousMode}
                    onCheckedChange={setAnonymousMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isDarkMode ?
                      <Moon
                        className="w-5 h-5 transition-colors duration-300"
                        style={{ color: 'var(--icon-tertiary)' }}
                      /> :
                      <Sun
                        className="w-5 h-5 transition-colors duration-300"
                        style={{ color: 'var(--icon-tertiary)' }}
                      />
                    }
                    <div>
                      <h3
                        className="font-medium transition-colors duration-300"
                        style={{ color: 'var(--theme-text-primary)' }}
                      >
                        Dark Mode
                      </h3>
                      <p
                        className="text-sm transition-colors duration-300"
                        style={{ color: 'var(--theme-text-secondary)' }}
                      >
                        Switch to dark theme
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>
              </CardContent>
            </Card>

            <Card
              className="backdrop-blur-sm border-0 shadow-lg transition-colors duration-300"
              style={{ backgroundColor: 'var(--theme-card-bg)' }}
            >
              <CardHeader>
                <CardTitle
                  className="font-['Poppins'] text-xl transition-colors duration-300"
                  style={{ color: 'var(--theme-text-primary)' }}
                >
                  Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start transition-colors duration-300 hover:bg-opacity-10"
                      onClick={() => setEditName(displayName)}
                      style={{
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        backgroundColor: 'var(--card-bg-elevated)',
                        '--tw-bg-opacity': '0.5'
                      }}
                    >
                      <User
                        className="w-4 h-4 mr-2"
                        style={{ color: 'var(--icon-primary)' }}
                      />
                      Edit Profile Information
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]" style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)' }}>
                    <DialogHeader>
                      <DialogTitle style={{ color: 'var(--theme-text-primary)' }}>Edit Profile</DialogTitle>
                      <DialogDescription style={{ color: 'var(--theme-text-secondary)' }}>
                        Make changes to your profile here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" style={{ color: 'var(--theme-text-primary)' }}>Display Name</Label>
                        <Input
                          id="name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          style={{ backgroundColor: 'var(--theme-card-bg)', color: 'var(--theme-text-primary)', borderColor: 'var(--theme-border)' }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline" style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text-primary)' }}>Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="submit" onClick={handleEditProfile} disabled={isUpdating} style={{ backgroundColor: 'var(--theme-primary)', color: 'white' }}>
                          Save changes
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start transition-colors duration-300 hover:bg-opacity-10"
                      style={{
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        backgroundColor: 'var(--card-bg-elevated)',
                        '--tw-bg-opacity': '0.5'
                      }}
                    >
                      <Settings
                        className="w-4 h-4 mr-2"
                        style={{ color: 'var(--icon-secondary)' }}
                      />
                      Advanced Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]" style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)' }}>
                    <DialogHeader>
                      <DialogTitle style={{ color: 'var(--theme-text-primary)' }}>Advanced Settings</DialogTitle>
                      <DialogDescription style={{ color: 'var(--theme-text-secondary)' }}>
                        Change your account password.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="password" style={{ color: 'var(--theme-text-primary)' }}>New Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          style={{ backgroundColor: 'var(--theme-card-bg)', color: 'var(--theme-text-primary)', borderColor: 'var(--theme-border)' }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline" style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text-primary)' }}>Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="submit" onClick={handlePasswordChange} disabled={isUpdating || newPassword.length < 6} style={{ backgroundColor: 'var(--theme-primary)', color: 'white' }}>
                          Update Password
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 transition-colors duration-300"
                >
                  <LogOut className="w-4 h-4 mr-2 text-red-600" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}