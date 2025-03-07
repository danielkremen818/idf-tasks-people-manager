
import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { AppContextType, Department, ExemptionType, Person, Task } from '@/lib/types';
import { initialDepartments, initialExemptions, initialPeople, initialTasks } from '@/lib/data';
import { toast } from '@/hooks/use-toast';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [exemptions, setExemptions] = useState<ExemptionType[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Load data from localStorage or use initial data
    const loadedDepartments = localStorage.getItem('departments');
    const loadedExemptions = localStorage.getItem('exemptions');
    const loadedPeople = localStorage.getItem('people');
    const loadedTasks = localStorage.getItem('tasks');

    if (loadedDepartments) {
      setDepartments(JSON.parse(loadedDepartments));
    } else {
      setDepartments(initialDepartments);
    }

    if (loadedExemptions) {
      setExemptions(JSON.parse(loadedExemptions));
    } else {
      setExemptions(initialExemptions);
    }

    if (loadedPeople) {
      setPeople(JSON.parse(loadedPeople));
    } else {
      setPeople(initialPeople);
    }

    if (loadedTasks) {
      setTasks(JSON.parse(loadedTasks));
    } else {
      setTasks(initialTasks);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('departments', JSON.stringify(departments));
    localStorage.setItem('exemptions', JSON.stringify(exemptions));
    localStorage.setItem('people', JSON.stringify(people));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [departments, exemptions, people, tasks]);

  const addDepartment = (department: Department) => {
    setDepartments([...departments, department]);
    toast({
      title: "יחידה נוספה",
      description: `היחידה "${department.name}" נוספה בהצלחה`,
    });
  };

  const updateDepartment = (department: Department) => {
    setDepartments(departments.map(d => d.id === department.id ? department : d));
    toast({
      title: "יחידה עודכנה",
      description: `היחידה "${department.name}" עודכנה בהצלחה`,
    });
  };

  const deleteDepartment = (id: string) => {
    const departmentToDelete = departments.find(d => d.id === id);
    if (departmentToDelete) {
      setDepartments(departments.filter(d => d.id !== id));
      toast({
        title: "יחידה נמחקה",
        description: `היחידה "${departmentToDelete.name}" נמחקה בהצלחה`,
      });
    }
  };

  const addExemption = (exemption: ExemptionType) => {
    setExemptions([...exemptions, exemption]);
    toast({
      title: "פטור נוסף",
      description: `הפטור "${exemption.name}" נוסף בהצלחה`,
    });
  };

  const updateExemption = (exemption: ExemptionType) => {
    setExemptions(exemptions.map(e => e.id === exemption.id ? exemption : e));
    toast({
      title: "פטור עודכן",
      description: `הפטור "${exemption.name}" עודכן בהצלחה`,
    });
  };

  const deleteExemption = (id: string) => {
    const exemptionToDelete = exemptions.find(e => e.id === id);
    if (exemptionToDelete) {
      setExemptions(exemptions.filter(e => e.id !== id));
      toast({
        title: "פטור נמחק",
        description: `הפטור "${exemptionToDelete.name}" נמחק בהצלחה`,
      });
    }
  };

  const addPerson = (person: Person) => {
    setPeople([...people, person]);
    toast({
      title: "חייל נוסף",
      description: `החייל "${person.name}" נוסף בהצלחה`,
    });
  };

  const updatePerson = (person: Person) => {
    setPeople(people.map(p => p.id === person.id ? person : p));
    toast({
      title: "חייל עודכן",
      description: `החייל "${person.name}" עודכן בהצלחה`,
    });
  };

  const deletePerson = (id: string) => {
    const personToDelete = people.find(p => p.id === id);
    if (personToDelete) {
      setPeople(people.filter(p => p.id !== id));
      toast({
        title: "חייל נמחק",
        description: `החייל "${personToDelete.name}" נמחק בהצלחה`,
      });
    }
  };

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
    toast({
      title: "משימה נוספה",
      description: `המשימה "${task.title}" נוספה בהצלחה`,
    });
  };

  const updateTask = (task: Task) => {
    setTasks(tasks.map(t => t.id === task.id ? task : t));
    toast({
      title: "משימה עודכנה", 
      description: `המשימה "${task.title}" עודכנה בהצלחה`,
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setTasks(tasks.filter(t => t.id !== id));
      toast({
        title: "משימה נמחקה",
        description: `המשימה "${taskToDelete.title}" נמחקה בהצלחה`,
      });
    }
  };

  const value = {
    departments,
    exemptions,
    people,
    tasks,
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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
