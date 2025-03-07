
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Shield, LogIn, User, Key, AlertTriangle, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Clear any error message when inputs change
  useEffect(() => {
    if (error) setError('');
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-teal-500/10 mix-blend-overlay"></div>

      <div className="w-full max-w-md p-4 relative z-10 animate-fade-in">
        <Card className="border border-white/10 bg-black/40 backdrop-blur-xl text-white overflow-hidden shadow-xl">
          <CardHeader className="space-y-1 text-center relative">
            <div className="flex justify-center mb-4">
              <div className="relative animate-pulse-slow">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-70 -z-10"></div>
                <Lock className="h-16 w-16 text-white drop-shadow-glow" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent">
              TASK-FORCE
            </h1>
            
            <CardTitle className="text-lg font-semibold tracking-tight text-white/90 mt-1">
              Command & Control System
            </CardTitle>
            
            <CardDescription className="text-gray-400">
              Enter your credentials to access the system
            </CardDescription>
            
            {/* Animated border */}
            <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-purple-600/0 via-purple-600 to-purple-600/0"></div>
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600/0 via-blue-600 to-blue-600/0"></div>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-red-200 flex items-start gap-2 animate-fade-in">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4 login-form">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <LogIn className="mr-2 h-5 w-5" />
                      Access System
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              variant="link" 
              onClick={() => navigate('/register')}
              className="text-purple-400 hover:text-purple-300"
            >
              Don't have an account? Register here
            </Button>
          </CardFooter>
          
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-purple-600/20 blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-blue-600/20 blur-3xl"></div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
