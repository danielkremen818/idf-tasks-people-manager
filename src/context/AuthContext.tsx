
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User, UserRole } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import bcrypt from 'bcryptjs';

// For demo purposes only - in production this would be an environment variable
const JWT_SECRET = 'your-jwt-secret-key';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  allUsers: User[];
  deleteUser: (userId: string) => Promise<void>;
};

// Mock users for demonstration (would be in the database in a real implementation)
const mockUsers: (User & { passwordHash: string })[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'ADMIN',
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    passwordHash: bcrypt.hashSync('user123', 10),
    role: 'USER',
  },
  {
    id: '3',
    name: 'System Administrator',
    email: 'sysadmin@example.com',
    passwordHash: bcrypt.hashSync('sysadmin123', 10),
    role: 'ADMIN',
  },
  // Adding a default admin user as requested
  {
    id: '4',
    name: 'Task Force Commander',
    email: 'commander@taskforce.com',
    passwordHash: bcrypt.hashSync('commander123', 10),
    role: 'ADMIN',
  },
];

// Simple function to encode a user object to a token-like string
// This avoids using jsonwebtoken in the browser which can cause issues
const encodeToken = (user: Omit<User, 'passwordHash'>) => {
  const payload = JSON.stringify(user);
  const base64Payload = btoa(payload);
  return base64Payload;
};

// Function to decode the token
const decodeToken = (token: string) => {
  try {
    const payload = atob(token);
    return JSON.parse(payload) as User;
  } catch (error) {
    logger.error('Invalid token', { module: 'AuthContext', data: error });
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Load all users (without password hashes) for admin management
  useEffect(() => {
    const users = mockUsers.map(({ passwordHash, ...user }) => user);
    setAllUsers(users);
  }, []);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = decodeToken(token);
        if (decoded) {
          setUser(decoded);
          logger.info('User authenticated from token', { module: 'AuthContext' });
        } else {
          // Invalid token
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        logger.error('Invalid token, logging out', { module: 'AuthContext', data: error });
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call to your backend
      const user = mockUsers.find(u => u.email === email);
      
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw new Error('Invalid email or password');
      }

      // Create a simple token (not using JWT to avoid browser compatibility issues)
      const userToEncode = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      const token = encodeToken(userToEncode);

      // Store the token
      localStorage.setItem('authToken', token);
      
      // Set the user state
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      toast({
        title: "התחברות בוצעה בהצלחה",
        description: `ברוך הבא, ${user.name}!`,
      });
      
      logger.info('User logged in successfully', { module: 'AuthContext', data: { userId: user.id } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      toast({
        title: "שגיאה בהתחברות",
        description: errorMessage,
        variant: "destructive",
      });
      logger.error('Login failed', { module: 'AuthContext', data: error });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'USER') => {
    try {
      setIsLoading(true);
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('משתמש עם אימייל זה כבר קיים');
      }

      // In a real app, this would be an API call to your backend
      const passwordHash = bcrypt.hashSync(password, 10);
      const newUser = {
        id: `${mockUsers.length + 1}`,
        name,
        email,
        passwordHash,
        role,
      };

      // Add to mock users (in a real app this would be saved to the database)
      mockUsers.push(newUser);

      // Update allUsers state
      setAllUsers(prev => [...prev, { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }]);

      // Create and store token
      const userToEncode = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };
      const token = encodeToken(userToEncode);
      localStorage.setItem('authToken', token);

      // Set user state
      setUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });

      toast({
        title: "הרשמה בוצעה בהצלחה",
        description: `ברוך הבא, ${newUser.name}!`,
      });
      
      logger.info('User registered successfully', { module: 'AuthContext', data: { userId: newUser.id } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register';
      toast({
        title: "שגיאה בהרשמה",
        description: errorMessage,
        variant: "destructive",
      });
      logger.error('Registration failed', { module: 'AuthContext', data: error });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      setIsLoading(true);
      
      // Find the user to update
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update the user in mockUsers
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updates,
      };

      // Update allUsers state
      setAllUsers(prev => 
        prev.map(u => 
          u.id === userId ? { ...u, ...updates } : u
        )
      );

      // If the current user is being updated, update the user state and token
      if (user && user.id === userId) {
        const updatedUser = {
          ...user,
          ...updates
        };
        
        setUser(updatedUser);
        
        // Update the token
        const token = encodeToken(updatedUser);
        localStorage.setItem('authToken', token);
      }

      toast({
        title: "User Updated",
        description: "User information has been successfully updated",
      });
      
      logger.info('User updated successfully', { module: 'AuthContext', data: { userId } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      toast({
        title: "Error Updating User",
        description: errorMessage,
        variant: "destructive",
      });
      logger.error('User update failed', { module: 'AuthContext', data: error });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Find the user to delete
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Prevent deleting the current user
      if (user && user.id === userId) {
        throw new Error('Cannot delete your own account while logged in');
      }

      // Remove the user from mockUsers
      mockUsers.splice(userIndex, 1);

      // Update allUsers state
      setAllUsers(prev => prev.filter(u => u.id !== userId));

      toast({
        title: "User Deleted",
        description: "User has been successfully removed",
      });
      
      logger.info('User deleted successfully', { module: 'AuthContext', data: { userId } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      toast({
        title: "Error Deleting User",
        description: errorMessage,
        variant: "destructive",
      });
      logger.error('User deletion failed', { module: 'AuthContext', data: error });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    toast({
      title: "התנתקות בוצעה בהצלחה",
      description: "להתראות!",
    });
    logger.info('User logged out', { module: 'AuthContext' });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      register,
      updateUser,
      allUsers,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
