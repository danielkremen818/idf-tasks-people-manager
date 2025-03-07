
import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { Department } from '@/lib/types';
import { initialDepartments } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { logger, handleError } from '@/lib/logger';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from './BaseContext';

interface DepartmentContextProps {
  departments: Department[];
  addDepartment: (department: Department) => void;
  updateDepartment: (department: Department) => void;
  deleteDepartment: (id: string) => void;
}

const DepartmentContext = createContext<DepartmentContextProps | undefined>(undefined);

export const DepartmentProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [departments, setDepartments] = useLocalStorage<Department[]>('departments', []);

  // Initialize departments from local storage or use initial data
  useEffect(() => {
    if (isAuthenticated && departments.length === 0) {
      try {
        logger.info('Loading departments data', { module: 'DepartmentContext' });
        setDepartments(initialDepartments.map(dept => ({
          ...dept,
          name: dept.name.replace(/יחידה/g, 'מדור')
        })));
        logger.debug('Using initial departments data', { module: 'DepartmentContext' });
      } catch (err) {
        handleError(err, 'DepartmentContext');
      }
    }
  }, [isAuthenticated, departments.length, setDepartments]);

  const addDepartment = (department: Department) => {
    try {
      setDepartments([...departments, department]);
      toast({
        title: "מדור נוסף",
        description: `המדור "${department.name}" נוסף בהצלחה`,
      });
      logger.info(`Department added: ${department.name}`, { module: 'DepartmentContext' });
    } catch (err) {
      handleError(err, 'DepartmentContext');
      toast({
        title: "שגיאה בהוספת מדור",
        description: "אירעה שגיאה בהוספת המדור. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const updateDepartment = (department: Department) => {
    try {
      setDepartments(departments.map(d => d.id === department.id ? department : d));
      toast({
        title: "מדור עודכן",
        description: `המדור "${department.name}" עודכן בהצלחה`,
      });
      logger.info(`Department updated: ${department.name}`, { module: 'DepartmentContext' });
    } catch (err) {
      handleError(err, 'DepartmentContext');
      toast({
        title: "שגיאה בעדכון מדור",
        description: "אירעה שגיאה בעדכון המדור. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const deleteDepartment = (id: string) => {
    try {
      const departmentToDelete = departments.find(d => d.id === id);
      if (departmentToDelete) {
        setDepartments(departments.filter(d => d.id !== id));
        toast({
          title: "מדור נמחק",
          description: `המדור "${departmentToDelete.name}" נמחק בהצלחה`,
        });
        logger.info(`Department deleted: ${departmentToDelete.name}`, { module: 'DepartmentContext' });
      }
    } catch (err) {
      handleError(err, 'DepartmentContext');
      toast({
        title: "שגיאה במחיקת מדור",
        description: "אירעה שגיאה במחיקת המדור. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const value = {
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  };

  return <DepartmentContext.Provider value={value}>{children}</DepartmentContext.Provider>;
};

export const useDepartmentContext = (): DepartmentContextProps => {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error('useDepartmentContext must be used within a DepartmentProvider');
  }
  return context;
};
