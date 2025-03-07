
import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

// This context provides base functionality shared across domain-specific contexts
export interface BaseContextProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
  isAuthenticated: boolean;
}

const BaseContext = createContext<BaseContextProps | undefined>(undefined);

export const BaseProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Provide a loading component that can be reused across contexts
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-500 border-r-transparent align-[-0.125em]" role="status">
            <span className="sr-only">טוען...</span>
          </div>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-white"
          >
            טוען נתונים...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const value = {
    isLoading,
    setIsLoading,
    error,
    setError,
    isAuthenticated,
  };

  return <BaseContext.Provider value={value}>{children}</BaseContext.Provider>;
};

export const useBaseContext = (): BaseContextProps => {
  const context = useContext(BaseContext);
  if (context === undefined) {
    throw new Error('useBaseContext must be used within a BaseProvider');
  }
  return context;
};

// Utility hook for storing data in localStorage
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error(`Error reading localStorage key "${key}":`, { data: error });
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      logger.error(`Error writing to localStorage key "${key}":`, { data: error });
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
};
