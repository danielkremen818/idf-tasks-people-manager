
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Shield, LogIn, User, Key, ChevronRight, AlertTriangle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
  };
  
  const errorVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[url('/military-texture.jpg')] bg-cover bg-blend-overlay">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md p-4"
      >
        <Card className="border-gray-700 bg-gray-800/90 backdrop-blur-sm text-white overflow-hidden">
          <motion.div variants={itemVariants}>
            <CardHeader className="space-y-1 text-center relative">
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
              >
                <Shield className="h-12 w-12 text-amber-500 drop-shadow-glow" />
              </motion.div>
              <CardTitle className="text-2xl font-bold tracking-tight text-amber-500">
                IDF Command & Control
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter your credentials to access the system
              </CardDescription>
              
              <motion.div 
                className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
              />
            </CardHeader>
          </motion.div>
          
          <CardContent>
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-red-200 flex items-start gap-2"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div className="space-y-2" variants={itemVariants}>
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
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </motion.div>
              
              <motion.div className="space-y-2" variants={itemVariants}>
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
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <LogIn className="mr-2 h-5 w-5" />
                        Login
                      </span>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </CardContent>
          
          <motion.div variants={itemVariants}>
            <CardFooter className="flex flex-col space-y-4">
              <div 
                className="text-center text-sm text-gray-400 cursor-pointer flex flex-col items-center"
                onClick={() => setShowDemo(!showDemo)}
              >
                <span className="flex items-center">
                  Demo Credentials
                  <motion.span
                    animate={{ rotate: showDemo ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </motion.span>
                </span>
                
                <AnimatePresence>
                  {showDemo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden w-full"
                    >
                      <div className="mt-2 space-y-1 bg-gray-700/50 p-2 rounded-md">
                        <div className="flex justify-between">
                          <span>Admin:</span>
                          <span className="text-amber-400">sysadmin@example.com / sysadmin123</span>
                        </div>
                        <div className="flex justify-between">
                          <span>User:</span>
                          <span className="text-amber-400">user@example.com / user123</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Button 
                variant="link" 
                onClick={() => navigate('/register')}
                className="text-amber-500 hover:text-amber-400"
              >
                Don't have an account? Register here
              </Button>
            </CardFooter>
          </motion.div>
          
          <motion.div 
            className="absolute inset-0 border border-amber-500/20 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
