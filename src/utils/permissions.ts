import { Role } from '../types';

export interface NavItemConfig {
  id: string;
  labelKey: keyof typeof import('./translations').translations.en;
  iconName: string;
  allowedRoles: Role[];
  badgeKey?: 'students' | 'teachers' | 'fees' | 'notices' | 'homework';
}

export const navigationItems: NavItemConfig[] = [
  {
    id: 'dashboard',
    labelKey: 'dashboard',
    iconName: 'LayoutDashboard',
    allowedRoles: ['Admin', 'Principal', 'Teacher', 'Accountant', 'Staff']
  },
  {
    id: 'students',
    labelKey: 'students',
    iconName: 'Users',
    allowedRoles: ['Admin', 'Principal', 'Teacher', 'Staff'],
    badgeKey: 'students'
  },
  {
    id: 'teachers',
    labelKey: 'teachers',
    iconName: 'GraduationCap',
    allowedRoles: ['Admin', 'Principal'],
    badgeKey: 'teachers'
  },
  {
    id: 'classes',
    labelKey: 'classes',
    iconName: 'School',
    allowedRoles: ['Admin', 'Principal', 'Teacher']
  },
  {
    id: 'student-attendance',
    labelKey: 'studentAttendance',
    iconName: 'CalendarCheck',
    allowedRoles: ['Admin', 'Principal', 'Teacher']
  },
  {
    id: 'teacher-attendance',
    labelKey: 'teacherAttendance',
    iconName: 'UserCheck',
    allowedRoles: ['Admin', 'Principal']
  },
  {
    id: 'fees',
    labelKey: 'fees',
    iconName: 'Receipt',
    allowedRoles: ['Admin', 'Accountant', 'Principal'],
    badgeKey: 'fees'
  },
  {
    id: 'exams',
    labelKey: 'exams',
    iconName: 'Award',
    allowedRoles: ['Admin', 'Principal', 'Teacher']
  },
  {
    id: 'report-card',
    labelKey: 'reportCard',
    iconName: 'FileSpreadsheet',
    allowedRoles: ['Admin', 'Principal', 'Teacher']
  },
  {
    id: 'homework',
    labelKey: 'homework',
    iconName: 'BookOpen',
    allowedRoles: ['Admin', 'Principal', 'Teacher'],
    badgeKey: 'homework'
  },
  {
    id: 'timetable',
    labelKey: 'timetable',
    iconName: 'Clock',
    allowedRoles: ['Admin', 'Principal', 'Teacher']
  },
  {
    id: 'expenses',
    labelKey: 'expenses',
    iconName: 'Wallet',
    allowedRoles: ['Admin', 'Accountant']
  },
  {
    id: 'transport',
    labelKey: 'transport',
    iconName: 'Bus',
    allowedRoles: ['Admin', 'Principal', 'Staff']
  },
  {
    id: 'staff',
    labelKey: 'staff',
    iconName: 'Briefcase',
    allowedRoles: ['Admin', 'Principal']
  },
  {
    id: 'notices',
    labelKey: 'notices',
    iconName: 'Bell',
    allowedRoles: ['Admin', 'Principal', 'Teacher', 'Accountant', 'Staff'],
    badgeKey: 'notices'
  },
  {
    id: 'certificates',
    labelKey: 'certificates',
    iconName: 'Scroll',
    allowedRoles: ['Admin', 'Principal']
  },
  {
    id: 'id-cards',
    labelKey: 'idCards',
    iconName: 'CreditCard',
    allowedRoles: ['Admin', 'Principal', 'Staff']
  },
  {
    id: 'reports',
    labelKey: 'reports',
    iconName: 'BarChart3',
    allowedRoles: ['Admin', 'Principal', 'Accountant']
  },
  {
    id: 'settings',
    labelKey: 'settings',
    iconName: 'Settings',
    allowedRoles: ['Admin']
  }
];

export const canRoleAccess = (role: Role, viewId: string): boolean => {
  const item = navigationItems.find((n) => n.id === viewId);
  if (!item) return false;
  return item.allowedRoles.includes(role);
};
