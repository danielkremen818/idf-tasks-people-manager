
import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { Person } from '@/lib/types';
import { initialPeople } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { logger, handleError } from '@/lib/logger';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from './BaseContext';

interface PeopleContextProps {
  people: Person[];
  addPerson: (person: Person) => void;
  updatePerson: (person: Person) => void;
  deletePerson: (id: string) => void;
}

const PeopleContext = createContext<PeopleContextProps | undefined>(undefined);

export const PeopleProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [people, setPeople] = useLocalStorage<Person[]>('people', []);

  // Initialize people from local storage or use initial data
  useEffect(() => {
    if (isAuthenticated && people.length === 0) {
      try {
        logger.info('Loading people data', { module: 'PeopleContext' });
        setPeople(initialPeople);
        logger.debug('Using initial people data', { module: 'PeopleContext' });
      } catch (err) {
        handleError(err, 'PeopleContext');
      }
    }
  }, [isAuthenticated, people.length, setPeople]);

  const addPerson = (person: Person) => {
    try {
      setPeople([...people, person]);
      toast({
        title: "חייל נוסף",
        description: `החייל "${person.name}" נוסף בהצלחה`,
      });
      logger.info(`Person added: ${person.name}`, { module: 'PeopleContext' });
    } catch (err) {
      handleError(err, 'PeopleContext');
      toast({
        title: "שגיאה בהוספת חייל",
        description: "אירעה שגיאה בהוספת החייל. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const updatePerson = (person: Person) => {
    try {
      setPeople(people.map(p => p.id === person.id ? person : p));
      toast({
        title: "חייל עודכן",
        description: `החייל "${person.name}" עודכן בהצלחה`,
      });
      logger.info(`Person updated: ${person.name}`, { module: 'PeopleContext' });
    } catch (err) {
      handleError(err, 'PeopleContext');
      toast({
        title: "שגיאה בעדכון חייל",
        description: "אירעה שגיאה בעדכון החייל. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const deletePerson = (id: string) => {
    try {
      const personToDelete = people.find(p => p.id === id);
      if (personToDelete) {
        setPeople(people.filter(p => p.id !== id));
        toast({
          title: "חייל נמחק",
          description: `החייל "${personToDelete.name}" נמחק בהצלחה`,
        });
        logger.info(`Person deleted: ${personToDelete.name}`, { module: 'PeopleContext' });
      }
    } catch (err) {
      handleError(err, 'PeopleContext');
      toast({
        title: "שגיאה במחיקת חייל",
        description: "אירעה שגיאה במחיקת החייל. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const value = {
    people,
    addPerson,
    updatePerson,
    deletePerson,
  };

  return <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>;
};

export const usePeopleContext = (): PeopleContextProps => {
  const context = useContext(PeopleContext);
  if (context === undefined) {
    throw new Error('usePeopleContext must be used within a PeopleProvider');
  }
  return context;
};
