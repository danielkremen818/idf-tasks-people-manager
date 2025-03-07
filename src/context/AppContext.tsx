
import React, { useContext, createContext, PropsWithChildren } from 'react';
import { AppContextType } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { BaseProvider, useBaseContext } from './BaseContext';
import { DepartmentProvider, useDepartmentContext } from './DepartmentContext';
import { ExemptionProvider, useExemptionContext } from './ExemptionContext';
import { PeopleProvider, usePeopleContext } from './PeopleContext';
import { TaskProvider, useTaskContext } from './TaskContext';

// Create a composite context that combines all domain-specific contexts
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <BaseProvider>
      <DepartmentProvider>
        <ExemptionProvider>
          <PeopleProvider>
            <TaskProvider>
              <AppContextImplementation>{children}</AppContextImplementation>
            </TaskProvider>
          </PeopleProvider>
        </ExemptionProvider>
      </DepartmentProvider>
    </BaseProvider>
  );
};

// The actual implementation that combines all context values
const AppContextImplementation: React.FC<PropsWithChildren> = ({ children }) => {
  const { user, isAuthenticated, login, logout, register } = useAuth();
  const { isLoading, error } = useBaseContext();
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useDepartmentContext();
  const { exemptions, addExemption, updateExemption, deleteExemption } = useExemptionContext();
  const { people, addPerson, updatePerson, deletePerson } = usePeopleContext();
  const { tasks, addTask, updateTask, deleteTask } = useTaskContext();

  // Combine all context values into one
  const value: AppContextType = {
    departments,
    exemptions,
    people,
    tasks,
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
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

  // Don't render if still loading - BaseProvider already shows loading state
  if (isLoading) {
    return null;
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
