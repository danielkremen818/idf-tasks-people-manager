import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { AppContextType, Department, ExemptionType, Person, Task, User } from '@/lib/types';
import { initialDepartments, initialExemptions, initialPeople, initialTasks } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { logger, handleError } from '@/lib/logger';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [exemptions, setExemptions] = useState<ExemptionType[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = () => {
      try {
        logger.info('Loading application data', { module: 'AppContext' });
        setIsLoading(true);

        // Only load data if the user is authenticated
        if (!isAuthenticated) {
          setIsLoading(false);
          return;
        }

        // Load data from localStorage or use initial data
        const loadedDepartments = localStorage.getItem('departments');
        const loadedExemptions = localStorage.getItem('exemptions');
        const loadedPeople = localStorage.getItem('people');
        const loadedTasks = localStorage.getItem('tasks');

        if (loadedDepartments) {
          setDepartments(JSON.parse(loadedDepartments));
        } else {
          setDepartments(initialDepartments.map(dept => ({
            ...dept,
            name: dept.name.replace(/יחידה/g, 'מדור')
          })));
          logger.debug('Using initial departments data', { module: 'AppContext' });
        }

        if (loadedExemptions) {
          setExemptions(JSON.parse(loadedExemptions));
        } else {
          setExemptions(initialExemptions);
          logger.debug('Using initial exemptions data', { module: 'AppContext' });
        }

        if (loadedPeople) {
          setPeople(JSON.parse(loadedPeople));
        } else {
          setPeople(initialPeople);
          logger.debug('Using initial people data', { module: 'AppContext' });
        }

        if (loadedTasks) {
          setTasks(JSON.parse(loadedTasks));
        } else {
          setTasks(initialTasks);
          logger.debug('Using initial tasks data', { module: 'AppContext' });
        }

        logger.info('Application data loaded successfully', { module: 'AppContext' });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load data');
        setError(error);
        console.error(error);
        toast({
          title: "שגיאה בטעינת נתונים",
          description: "אירעה שגיאה בטעינת הנתונים. אנא רענן את הדף.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  // Save to localStorage whenever data changes or when auth status changes
  useEffect(() => {
    try {
      if (!isLoading && isAuthenticated) {
        logger.debug('Saving data to localStorage', { module: 'AppContext' });
        localStorage.setItem('departments', JSON.stringify(departments));
        localStorage.setItem('exemptions', JSON.stringify(exemptions));
        localStorage.setItem('people', JSON.stringify(people));
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "שגיאה בשמירת נתונים",
        description: "אירעה שגיאה בשמירת הנתונים במערכת.",
        variant: "destructive",
      });
    }
  }, [departments, exemptions, people, tasks, isLoading, isAuthenticated]);

  const addDepartment = (department: Department) => {
    try {
      setDepartments([...departments, department]);
      toast({
        title: "מדור נוסף",
        description: `המדור "${department.name}" נוסף בהצלחה`,
      });
      logger.info(`Department added: ${department.name}`, { module: 'AppContext' });
    } catch (err) {
      console.error(err);
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
      logger.info(`Department updated: ${department.name}`, { module: 'AppContext' });
    } catch (err) {
      console.error(err);
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
        logger.info(`Department deleted: ${departmentToDelete.name}`, { module: 'AppContext' });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "שגיאה במחיקת מדור",
        description: "אירעה שגיאה במחיקת המדור. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const addExemption = (exemption: ExemptionType) => {
    try {
      setExemptions([...exemptions, exemption]);
      toast({
        title: "פטור נוסף",
        description: `הפטור "${exemption.name}" נוסף בהצלחה`,
      });
      logger.info(`Exemption added: ${exemption.name}`, { module: 'AppContext' });
    } catch (err) {
      handleError(err, 'AppContext');
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
      logger.info(`Exemption updated: ${exemption.name}`, { module: 'AppContext' });
    } catch (err) {
      handleError(err, 'AppContext');
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
        logger.info(`Exemption deleted: ${exemptionToDelete.name}`, { module: 'AppContext' });
      }
    } catch (err) {
      handleError(err, 'AppContext');
      toast({
        title: "שגיאה במחיקת פטור",
        description: "אירעה שגיאה במחיקת הפטור. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const addPerson = (person: Person) => {
    try {
      setPeople([...people, person]);
      toast({
        title: "חייל נוסף",
        description: `החייל "${person.name}" נוסף בהצלחה`,
      });
      logger.info(`Person added: ${person.name}`, { module: 'AppContext' });
    } catch (err) {
      handleError(err, 'AppContext');
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
      logger.info(`Person updated: ${person.name}`, { module: 'AppContext' });
    } catch (err) {
      handleError(err, 'AppContext');
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
        logger.info(`Person deleted: ${personToDelete.name}`, { module: 'AppContext' });
      }
    } catch (err) {
      handleError(err, 'AppContext');
      toast({
        title: "שגיאה במחיקת חייל",
        description: "אירעה שגיאה במחיקת החייל. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const addTask = (task: Task) => {
    try {
      setTasks([...tasks, task]);
      toast({
        title: "משימה נוספה",
        description: `המשימה "${task.title}" נוספה בהצלחה`,
      });
      logger.info(`Task added: ${task.title}`, { module: 'AppContext' });
    } catch (err) {
      handleError(err, 'AppContext');
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
      logger.info(`Task updated: ${task.title}`, { module: 'AppContext' });
    } catch (err) {
      handleError(err, 'AppContext');
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
        logger.info(`Task deleted: ${taskToDelete.title}`, { module: 'AppContext' });
      }
    } catch (err) {
      handleError(err, 'AppContext');
      toast({
        title: "שגיאה במחיקת משימה",
        description: "אירעה שגיאה במחיקת המשימה. אנא נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const value = {
    departments,
    exemptions,
    people,
    tasks,
    user: user,
    isAuthenticated,
    isLoading,
    error,
    login: async () => {},  // These are handled in AuthContext
    logout: () => {},       // These are handled in AuthContext
    register: async () => {}, // These are handled in AuthContext
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addExemption,
    updateExemption,
    deleteExemption,
    addPerson,
    updatePerson,
    deletePerson,
    addTask,
    updateTask,
    deleteTask,
  };

  // Show loading state
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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
