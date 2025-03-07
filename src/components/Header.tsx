
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Clipboard, 
  Building2, 
  ShieldAlert,
  Home,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: <Home size={16} />, label: 'ראשי' },
    { path: '/people', icon: <Users size={16} />, label: 'חיילים' },
    { path: '/tasks', icon: <Clipboard size={16} />, label: 'משימות' },
    { path: '/departments', icon: <Building2 size={16} />, label: 'מדורים' },
    { path: '/exemptions', icon: <ShieldAlert size={16} />, label: 'פטורים' },
    { path: '/settings', icon: <Settings size={16} />, label: 'הגדרות' },
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 border-b border-gray-700 shadow-md sticky top-0 z-10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-amber-500">מערכת פיקוד ושליטה צה״לית</h1>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1 rtl:space-x-reverse">
            {navItems.map(item => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={item.path}>
                  <Button 
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`flex items-center gap-2 ${isActive(item.path) ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Button>
                </Link>
              </motion.div>
            ))}
            
            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost"
                  onClick={logout}
                  className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700 mr-2"
                >
                  <LogOut size={16} />
                  <span>התנתק</span>
                </Button>
              </motion.div>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
