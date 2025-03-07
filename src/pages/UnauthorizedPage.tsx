
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-6 max-w-md"
      >
        <ShieldAlert className="h-24 w-24 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">אין לך הרשאה מתאימה</h1>
        <p className="text-gray-400 mb-8">
          אין לך הרשאות גישה מספקות לצפייה בעמוד זה. אנא פנה למנהל המערכת אם אתה חושב שזו טעות.
        </p>
        <Button 
          onClick={() => navigate(-1)} 
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          חזור לעמוד הקודם
        </Button>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
