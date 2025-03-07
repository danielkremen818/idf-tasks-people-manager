
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Clipboard, 
  Building2, 
  ShieldAlert, 
  Home 
} from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">מנהל המשימות והחיילים</h1>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link to="/">
              <Button 
                variant={isActive('/') ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Home size={16} />
                <span>ראשי</span>
              </Button>
            </Link>
            <Link to="/people">
              <Button 
                variant={isActive('/people') ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Users size={16} />
                <span>חיילים</span>
              </Button>
            </Link>
            <Link to="/tasks">
              <Button 
                variant={isActive('/tasks') ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Clipboard size={16} />
                <span>משימות</span>
              </Button>
            </Link>
            <Link to="/departments">
              <Button 
                variant={isActive('/departments') ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Building2 size={16} />
                <span>יחידות</span>
              </Button>
            </Link>
            <Link to="/exemptions">
              <Button 
                variant={isActive('/exemptions') ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <ShieldAlert size={16} />
                <span>פטורים</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
