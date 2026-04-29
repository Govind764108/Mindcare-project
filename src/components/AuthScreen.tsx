import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { User, Lock, Mail, ArrowRight, Activity } from 'lucide-react';

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const { login, register, error, bypassLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--theme-bg-gradient)' }}>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#6C63FF] to-[#A7D8FF] rounded-2xl flex items-center justify-center mb-4 shadow-lg transform -rotate-6">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-['Poppins'] font-bold text-gray-900 dark:text-white">
            MindCare Portal
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your personal mental wellness companion
          </p>
        </div>

        <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-['Poppins']">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Sign up to start your wellness journey'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  {error}
                </div>
              )}
              
              {!isLogin && (
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6C63FF] outline-none dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6C63FF] outline-none dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6C63FF] outline-none dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6C63FF] hover:bg-[#5b54d9] text-white py-6"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={bypassLogin}
                className="w-full py-6 text-gray-700 dark:text-gray-300"
              >
                Continue as Guest (Bypass Firebase)
              </Button>
              
              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-[#6C63FF] hover:underline"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
