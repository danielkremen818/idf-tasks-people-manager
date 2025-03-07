
import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { ExemptionType } from '@/lib/types';
import { initialExemptions } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { logger, handleError } from '@/lib/logger';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from './BaseContext';

interface ExemptionContextProps {
  exemptions: ExemptionType[];
  addExemption: (exemption: ExemptionType) => void;
  updateExemption: (exemption: ExemptionType) => void;
  deleteExemption: (id: string) => void;
}

const ExemptionContext = createContext<ExemptionContextProps | undefined>(undefined);

export const ExemptionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [exemptions, setExemptions] = useLocalStorage<ExemptionType[]>('exemptions', []);

  // Initialize exemptions from local storage or use initial data
  useEffect(() => {
    if (isAuthenticated && exemptions.length === 0) {
      try {
        logger.info('Loading exemptions data', { module: 'ExemptionContext' });
        setExemptions(initialExemptions);
        logger.debug('Using initial exemptions data', { module: 'ExemptionContext' });
      } catch (err) {
        handleError(err, 'ExemptionContext');
      }
    }
  }, [isAuthenticated, exemptions.length, setExemptions]);

  const addExemption = (exemption: ExemptionType) => {
    try {
      setExemptions([...exemptions, exemption]);
      toast({
        title: "פטור נוסף",
        description: `הפטור "${exemption.name}" נוסף בהצלחה`,
      });
      logger.info(`Exemption added: ${exemption.name}`, { module: 'ExemptionContext' });
    } catch (err) {
      handleError(err, 'ExemptionContext');
      toast({
        title: "שגיאה בהוספת פטור",
        description: "אירעה שגיאה בהוספת הפטור. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const updateExemption = (exemption: ExemptionType) => {
    try {
      setExemptions(exemptions.map(e => e.id === exemption.id ? exemption : e));
      toast({
        title: "פטור עודכן",
        description: `הפטור "${exemption.name}" עודכן בהצלחה`,
      });
      logger.info(`Exemption updated: ${exemption.name}`, { module: 'ExemptionContext' });
    } catch (err) {
      handleError(err, 'ExemptionContext');
      toast({
        title: "שגיאה בעדכון פטור",
        description: "אירעה שגיאה בעדכון הפטור. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const deleteExemption = (id: string) => {
    try {
      const exemptionToDelete = exemptions.find(e => e.id === id);
      if (exemptionToDelete) {
        setExemptions(exemptions.filter(e => e.id !== id));
        toast({
          title: "פטור נמחק",
          description: `הפטור "${exemptionToDelete.name}" נמחק בהצלחה`,
        });
        logger.info(`Exemption deleted: ${exemptionToDelete.name}`, { module: 'ExemptionContext' });
      }
    } catch (err) {
      handleError(err, 'ExemptionContext');
      toast({
        title: "שגיאה במחיקת פטור",
        description: "אירעה שגיאה במחיקת הפטור. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const value = {
    exemptions,
    addExemption,
    updateExemption,
    deleteExemption,
  };

  return <ExemptionContext.Provider value={value}>{children}</ExemptionContext.Provider>;
};

export const useExemptionContext = (): ExemptionContextProps => {
  const context = useContext(ExemptionContext);
  if (context === undefined) {
    throw new Error('useExemptionContext must be used within an ExemptionProvider');
  }
  return context;
};
