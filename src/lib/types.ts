
export type Department = {
  id: string;
  name: string;
  colorCode: string;
};

export type ExemptionType = {
  id: string;
  name: string;
  description: string;
};

export type Person = {
  id: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  available: boolean;
  emergencyContact: string;
  exemptionIds: string[];
  userId?: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  assignedPersonId: string | null;
  status: Status;
  priority: Priority;
  requiredSkills: string[];
  prohibitedExemptionIds: string[];
  dueDate: string;
  assignedById?: string;
};

export type Status = 'ממתין' | 'בביצוע' | 'הושלם' | 'בוטל';
export type Priority = 'נמוכה' | 'בינונית' | 'גבוהה' | 'דחופה';
export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'USER';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AppContextType = {
  departments: Department[];
  exemptions: ExemptionType[];
  people: Person[];
  tasks: Task[];
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  isAuthenticated: boolean;
  addDepartment: (department: Department) => void;
  updateDepartment: (department: Department) => void;
  deleteDepartment: (id: string) => void;
  addExemption: (exemption: ExemptionType) => void;
  updateExemption: (exemption: ExemptionType) => void;
  deleteExemption: (id: string) => void;
  addPerson: (person: Person) => void;
  updatePerson: (person: Person) => void;
  deletePerson: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
};
