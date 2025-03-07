
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
};

export type Task = {
  id: string;
  title: string;
  description: string;
  assignedPersonId: string | null;
  status: 'ממתין' | 'בביצוע' | 'הושלם' | 'בוטל';
  priority: 'נמוכה' | 'בינונית' | 'גבוהה' | 'דחופה';
  requiredSkills: string[];
  prohibitedExemptionIds: string[];
  dueDate: string;
};

export type Status = 'ממתין' | 'בביצוע' | 'הושלם' | 'בוטל';
export type Priority = 'נמוכה' | 'בינונית' | 'גבוהה' | 'דחופה';

export type AppContextType = {
  departments: Department[];
  exemptions: ExemptionType[];
  people: Person[];
  tasks: Task[];
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
