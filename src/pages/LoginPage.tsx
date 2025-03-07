
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Shield, LogIn, User, Key, ChevronRight, AlertTriangle, Lock } from 'lucide-react';

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
  
  const logoVariants = {
    hidden: { rotateY: 0 },
    visible: { 
      rotateY: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 5
      }
    }
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

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute rounded-full bg-white/5"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: `${Math.random() * 20 + 5}px`,
            height: `${Math.random() * 20 + 5}px`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-teal-500/10 mix-blend-overlay"></div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md p-4 relative z-10"
      >
        <Card className="border border-white/10 bg-black/40 backdrop-blur-xl text-white overflow-hidden shadow-xl">
          <motion.div variants={itemVariants}>
            <CardHeader className="space-y-1 text-center relative">
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ rotateY: 0 }}
                animate={{ 
                  rotateY: 360,
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 5
                  }
                }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: [0.8, 1.1, 0.9, 1],
                    rotateZ: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-70 -z-10"></div>
                  <Lock className="h-16 w-16 text-white drop-shadow-glow" />
                </motion.div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5, delay: 0.2 }
                }}
                className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent"
              >
                TASK-FORCE
              </motion.h1>
              
              <CardTitle className="text-lg font-semibold tracking-tight text-white/90 mt-1">
                Command & Control System
              </CardTitle>
              
              <CardDescription className="text-gray-400">
                Enter your credentials to access the system
              </CardDescription>
              
              {/* Animated border */}
              <motion.div 
                className="absolute top-0 right-0 h-1 bg-gradient-to-r from-purple-600/0 via-purple-600 to-purple-600/0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
              
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600/0 via-blue-600 to-blue-600/0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.7 }}
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
            
            <form onSubmit={handleSubmit} className="space-y-4 login-form">
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
                    className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:ring-purple-500 focus:border-purple-500"
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
                    className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium relative overflow-hidden group"
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
                      <>
                        <span className="flex items-center justify-center relative z-10">
                          <LogIn className="mr-2 h-5 w-5" />
                          Access System
                        </span>
                        <motion.span 
                          className="absolute inset-0 bg-white/10 z-0"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                      </>
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
                      <div className="mt-2 space-y-1 bg-white/5 p-3 rounded-md backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row md:justify-between gap-1">
                          <span className="font-semibold text-purple-400">Admin:</span>
                          <span className="text-white">admin@example.com / admin123</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between gap-1">
                          <span className="font-semibold text-purple-400">Task Force Commander:</span>
                          <span className="text-white">commander@taskforce.com / commander123</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between gap-1">
                          <span className="font-semibold text-purple-400">User:</span>
                          <span className="text-white">user@example.com / user123</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Button 
                variant="link" 
                onClick={() => navigate('/register')}
                className="text-purple-400 hover:text-purple-300"
              >
                Don't have an account? Register here
              </Button>
            </CardFooter>
          </motion.div>
          
          <motion.div 
            className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
          
          {/* Animated background elements */}
          <motion.div 
            className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-purple-600/20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.div 
            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-blue-600/20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
