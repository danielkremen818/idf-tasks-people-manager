
import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { Task } from '@/lib/types';
import { initialTasks } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { logger, handleError } from '@/lib/logger';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from './BaseContext';

interface TaskContextProps {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);

  // Initialize tasks from local storage or use initial data
  useEffect(() => {
    if (isAuthenticated && tasks.length === 0) {
      try {
        logger.info('Loading tasks data', { module: 'TaskContext' });
        setTasks(initialTasks);
        logger.debug('Using initial tasks data', { module: 'TaskContext' });
      } catch (err) {
        handleError(err, 'TaskContext');
      }
    }
  }, [isAuthenticated, tasks.length, setTasks]);

  const addTask = (task: Task) => {
    try {
      setTasks([...tasks, task]);
      toast({
        title: "משימה נוספה",
        description: `המשימה "${task.title}" נוספה בהצלחה`,
      });
      logger.info(`Task added: ${task.title}`, { module: 'TaskContext' });
    } catch (err) {
      handleError(err, 'TaskContext');
      toast({
        title: "שגיאה בהוספת משימה",
        description: "אירעה שגיאה בהוספת המשימה. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const updateTask = (task: Task) => {
    try {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
      toast({
        title: "משימה עודכנה",
        description: `המשימה "${task.title}" עודכנה בהצלחה`,
      });
      logger.info(`Task updated: ${task.title}`, { module: 'TaskContext' });
    } catch (err) {
      handleError(err, 'TaskContext');
      toast({
        title: "שגיאה בעדכון משימה",
        description: "אירעה שגיאה בעדכון המשימה. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const deleteTask = (id: string) => {
    try {
      const taskToDelete = tasks.find(t => t.id === id);
      if (taskToDelete) {
        setTasks(tasks.filter(t => t.id !== id));
        toast({
          title: "משימה נמחקה",
          description: `המשימה "${taskToDelete.title}" נמחקה בהצלחה`,
        });
        logger.info(`Task deleted: ${taskToDelete.title}`, { module: 'TaskContext' });
      }
    } catch (err) {
      handleError(err, 'TaskContext');
      toast({
        title: "שגיאה במחיקת משימה",
        description: "אירעה שגיאה במחיקת המשימה. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = (): TaskContextProps => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
