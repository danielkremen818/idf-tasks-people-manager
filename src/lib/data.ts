
import { Department, ExemptionType, Person, Task } from './types';

export const initialDepartments: Department[] = [
  { id: '1', name: 'גדוד 123', colorCode: '#3B82F6' },
  { id: '2', name: 'פלוגה א', colorCode: '#10B981' },
  { id: '3', name: 'מודיעין', colorCode: '#F59E0B' },
  { id: '4', name: 'לוגיסטיקה', colorCode: '#6366F1' },
];

export const initialExemptions: ExemptionType[] = [
  { id: '1', name: 'פרופיל 21', description: 'פטור מרימת משקל מעל 10 ק"ג' },
  { id: '2', name: 'פרופיל 24', description: 'פטור מפעילות גופנית מאומצת' },
  { id: '3', name: 'פרופיל 45', description: 'פטור מתורנויות לילה' },
  { id: '4', name: 'פרופיל 64', description: 'פטור מפעילות בשטח' },
];

export const initialPeople: Person[] = [
  {
    id: '1',
    name: 'דניאל כהן',
    email: 'daniel@example.com',
    phone: '054-1234567',
    departmentId: '1',
    available: true,
    emergencyContact: 'מיכל כהן, 052-7654321',
    exemptionIds: [],
  },
  {
    id: '2',
    name: 'גל לוי',
    email: 'gal@example.com',
    phone: '052-2345678',
    departmentId: '2',
    available: true,
    emergencyContact: 'רון לוי, 053-8765432',
    exemptionIds: ['1'],
  },
  {
    id: '3',
    name: 'יעל ישראלי',
    email: 'yael@example.com',
    phone: '053-3456789',
    departmentId: '3',
    available: false,
    emergencyContact: 'דוד ישראלי, 054-9876543',
    exemptionIds: ['3', '4'],
  },
  {
    id: '4',
    name: 'עומר רוזן',
    email: 'omer@example.com',
    phone: '058-4567890',
    departmentId: '4',
    available: true,
    emergencyContact: 'שירה רוזן, 050-1234567',
    exemptionIds: ['2'],
  },
];

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'תורנות מטבח',
    description: 'תורנות במטבח הבסיס מ-8:00 עד 14:00',
    assignedPersonId: '1',
    status: 'בביצוע',
    priority: 'בינונית',
    requiredSkills: ['מיומנויות בסיסיות במטבח'],
    prohibitedExemptionIds: ['1'],
    dueDate: '2023-06-15',
  },
  {
    id: '2',
    title: 'אבטחת שער',
    description: 'אבטחת שער הבסיס משמרת לילה',
    assignedPersonId: '2',
    status: 'ממתין',
    priority: 'גבוהה',
    requiredSkills: ['הכשרת שמירה', 'רישיון לנשק'],
    prohibitedExemptionIds: ['3'],
    dueDate: '2023-06-14',
  },
  {
    id: '3',
    title: 'תרגיל שטח',
    description: 'תרגיל ניווט בשטח פתוח',
    assignedPersonId: null,
    status: 'ממתין',
    priority: 'דחופה',
    requiredSkills: ['ניווט', 'כושר גופני'],
    prohibitedExemptionIds: ['2', '4'],
    dueDate: '2023-06-20',
  },
  {
    id: '4',
    title: 'העברת ציוד',
    description: 'העברת ציוד צבאי ממחסן א למחסן ב',
    assignedPersonId: '4',
    status: 'הושלם',
    priority: 'נמוכה',
    requiredSkills: [],
    prohibitedExemptionIds: ['1'],
    dueDate: '2023-06-10',
  },
];
