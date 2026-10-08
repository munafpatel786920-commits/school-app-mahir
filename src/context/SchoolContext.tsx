import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Teacher,
  Staff,
  ClassDefinition,
  AttendanceRecord,
  TeacherAttendanceRecord,
  FeePayment,
  ExamRecord,
  Homework,
  TimetableSlot,
  SchoolExpense,
  Vehicle,
  SchoolNotice,
  SchoolSettings,
  CertificateData,
  Role,
  Language
} from '../types';
import {
  initialSettings,
  initialClasses,
  initialStudents,
  initialTeachers,
  initialStaff,
  initialFeePayments,
  initialAttendance,
  initialTeacherAttendance,
  initialExamRecords,
  initialHomework,
  initialTimetable,
  initialExpenses,
  initialVehicles,
  initialNotices,
  initialCertificates
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}

interface SchoolContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => string;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;

  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => string;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  staff: Staff[];
  addStaff: (member: Omit<Staff, 'id'>) => string;
  updateStaff: (id: string, member: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  classes: ClassDefinition[];
  addClass: (cls: Omit<ClassDefinition, 'id'>) => void;
  updateClass: (id: string, cls: Partial<ClassDefinition>) => void;
  deleteClass: (id: string) => void;

  attendance: AttendanceRecord[];
  saveStudentAttendance: (records: AttendanceRecord[]) => void;
  getStudentAttendanceForDate: (date: string, className?: string, division?: string) => AttendanceRecord[];
  getStudentAttendanceStats: (studentId: string) => { totalDays: number; presentDays: number; percentage: number };

  teacherAttendance: TeacherAttendanceRecord[];
  saveTeacherAttendance: (records: TeacherAttendanceRecord[]) => void;
  getTeacherAttendanceForDate: (date: string) => TeacherAttendanceRecord[];

  fees: FeePayment[];
  addFeePayment: (fee: Omit<FeePayment, 'id' | 'receiptNo'>) => string;
  updateFeePayment: (id: string, fee: Partial<FeePayment>) => void;
  deleteFeePayment: (id: string) => void;

  exams: ExamRecord[];
  saveExamRecord: (exam: Omit<ExamRecord, 'id'> & { id?: string }) => void;
  deleteExamRecord: (id: string) => void;

  homework: Homework[];
  addHomework: (hw: Omit<Homework, 'id'>) => void;
  updateHomework: (id: string, hw: Partial<Homework>) => void;
  deleteHomework: (id: string) => void;

  timetable: TimetableSlot[];
  saveTimetableSlot: (slot: TimetableSlot) => void;
  deleteTimetableSlot: (id: string) => void;

  expenses: SchoolExpense[];
  addExpense: (expense: Omit<SchoolExpense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<SchoolExpense>) => void;
  deleteExpense: (id: string) => void;

  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  notices: SchoolNotice[];
  addNotice: (notice: Omit<SchoolNotice, 'id'>) => void;
  updateNotice: (id: string, notice: Partial<SchoolNotice>) => void;
  deleteNotice: (id: string) => void;

  certificates: CertificateData[];
  generateCertificate: (cert: Omit<CertificateData, 'id' | 'certificateNo'>) => string;
  deleteCertificate: (id: string) => void;

  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  removeToast: (id: string) => void;

  resetDemoData: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;

  // Active View State
  activeView: string;
  setActiveView: (view: string) => void;
  selectedStudentIdForProfile?: string | null;
  setSelectedStudentIdForProfile: (id: string | null) => void;
  selectedReceiptIdForPrint?: string | null;
  setSelectedReceiptIdForPrint: (id: string | null) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_PREFIX = 'sms_ikhar_';

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => getStoredItem<Role>('user_role', 'Admin'));
  const [language, setLanguageState] = useState<Language>(() => getStoredItem<Language>('language', 'en'));
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedStudentIdForProfile, setSelectedStudentIdForProfile] = useState<string | null>(null);
  const [selectedReceiptIdForPrint, setSelectedReceiptIdForPrint] = useState<string | null>(null);

  const [settings, setSettings] = useState<SchoolSettings>(() => getStoredItem('settings', initialSettings));
  const [students, setStudents] = useState<Student[]>(() => getStoredItem('students', initialStudents));
  const [teachers, setTeachers] = useState<Teacher[]>(() => getStoredItem('teachers', initialTeachers));
  const [staff, setStaff] = useState<Staff[]>(() => getStoredItem('staff', initialStaff));
  const [classes, setClasses] = useState<ClassDefinition[]>(() => getStoredItem('classes', initialClasses));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => getStoredItem('attendance', initialAttendance));
  const [teacherAttendance, setTeacherAttendance] = useState<TeacherAttendanceRecord[]>(() => getStoredItem('teacherAttendance', initialTeacherAttendance));
  const [fees, setFees] = useState<FeePayment[]>(() => getStoredItem('fees', initialFeePayments));
  const [exams, setExams] = useState<ExamRecord[]>(() => getStoredItem('exams', initialExamRecords));
  const [homework, setHomework] = useState<Homework[]>(() => getStoredItem('homework', initialHomework));
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => getStoredItem('timetable', initialTimetable));
  const [expenses, setExpenses] = useState<SchoolExpense[]>(() => getStoredItem('expenses', initialExpenses));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getStoredItem('vehicles', initialVehicles));
  const [notices, setNotices] = useState<SchoolNotice[]>(() => getStoredItem('notices', initialNotices));
  const [certificates, setCertificates] = useState<CertificateData[]>(() => getStoredItem('certificates', initialCertificates));

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize state changes to localStorage
  useEffect(() => { setStoredItem('user_role', role); }, [role]);
  useEffect(() => { setStoredItem('language', language); }, [language]);
  useEffect(() => { setStoredItem('settings', settings); }, [settings]);
  useEffect(() => { setStoredItem('students', students); }, [students]);
  useEffect(() => { setStoredItem('teachers', teachers); }, [teachers]);
  useEffect(() => { setStoredItem('staff', staff); }, [staff]);
  useEffect(() => { setStoredItem('classes', classes); }, [classes]);
  useEffect(() => { setStoredItem('attendance', attendance); }, [attendance]);
  useEffect(() => { setStoredItem('teacherAttendance', teacherAttendance); }, [teacherAttendance]);
  useEffect(() => { setStoredItem('fees', fees); }, [fees]);
  useEffect(() => { setStoredItem('exams', exams); }, [exams]);
  useEffect(() => { setStoredItem('homework', homework); }, [homework]);
  useEffect(() => { setStoredItem('timetable', timetable); }, [timetable]);
  useEffect(() => { setStoredItem('expenses', expenses); }, [expenses]);
  useEffect(() => { setStoredItem('vehicles', vehicles); }, [vehicles]);
  useEffect(() => { setStoredItem('notices', notices); }, [notices]);
  useEffect(() => { setStoredItem('certificates', certificates); }, [certificates]);

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message, timestamp: Date.now() }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    addToast('info', `Switched active profile to ${newRole}`);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    addToast('info', newLang === 'gu' ? 'ગુજરાતી ભાષા પસંદ કરી' : 'English language selected');
  };

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('success', 'School settings updated successfully');
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id'>): string => {
    const id = 's-' + Date.now();
    const newStudent: Student = { ...studentData, id };
    setStudents((prev) => [newStudent, ...prev]);
    addToast('success', `Student "${newStudent.name}" enrolled successfully`);
    return id;
  };

  const updateStudent = (id: string, updatedFields: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
    addToast('success', 'Student information updated');
  };

  const deleteStudent = (id: string) => {
    const st = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    addToast('info', `Student record ${st?.name || ''} deleted`);
  };

  const getStudentById = (id: string) => {
    return students.find((s) => s.id === id);
  };

  // Teacher CRUD
  const addTeacher = (teacherData: Omit<Teacher, 'id'>): string => {
    const id = 't-' + Date.now();
    const newTeacher: Teacher = { ...teacherData, id };
    setTeachers((prev) => [newTeacher, ...prev]);
    addToast('success', `Teacher "${newTeacher.name}" added`);
    return id;
  };

  const updateTeacher = (id: string, updatedFields: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
    addToast('success', 'Teacher record updated');
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    addToast('info', 'Teacher record removed');
  };

  // Staff CRUD
  const addStaff = (memberData: Omit<Staff, 'id'>): string => {
    const id = 'st-' + Date.now();
    const newStaff: Staff = { ...memberData, id };
    setStaff((prev) => [newStaff, ...prev]);
    addToast('success', `Staff member "${newStaff.name}" added`);
    return id;
  };

  const updateStaff = (id: string, updatedFields: Partial<Staff>) => {
    setStaff((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );
    addToast('success', 'Staff record updated');
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((m) => m.id !== id));
    addToast('info', 'Staff record removed');
  };

  // Classes CRUD
  const addClass = (clsData: Omit<ClassDefinition, 'id'>) => {
    const id = 'c-' + Date.now();
    setClasses((prev) => [...prev, { ...clsData, id }]);
    addToast('success', `Class ${clsData.name} created`);
  };

  const updateClass = (id: string, clsData: Partial<ClassDefinition>) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...clsData } : c))
    );
    addToast('success', 'Class structure updated');
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'Class removed');
  };

  // Attendance
  const saveStudentAttendance = (newRecords: AttendanceRecord[]) => {
    if (newRecords.length === 0) return;
    const targetDate = newRecords[0].date;
    const targetClass = newRecords[0].class;
    const targetDivision = newRecords[0].division;

    setAttendance((prev) => {
      // Remove any prior records for that specific date, class & division
      const filtered = prev.filter(
        (r) => !(r.date === targetDate && r.class === targetClass && r.division === targetDivision)
      );
      return [...filtered, ...newRecords];
    });
    addToast('success', `Attendance recorded for Class ${targetClass}-${targetDivision} on ${targetDate}`);
  };

  const getStudentAttendanceForDate = (date: string, className?: string, division?: string) => {
    return attendance.filter((r) => {
      const dateMatch = r.date === date;
      const classMatch = className ? r.class === className : true;
      const divMatch = division ? r.division === division : true;
      return dateMatch && classMatch && divMatch;
    });
  };

  const getStudentAttendanceStats = (studentId: string) => {
    const studentRecords = attendance.filter((r) => r.studentId === studentId);
    const totalDays = studentRecords.length;
    if (totalDays === 0) return { totalDays: 0, presentDays: 0, percentage: 100 };
    const presentDays = studentRecords.filter((r) => r.status === 'Present').length;
    const percentage = Math.round((presentDays / totalDays) * 100);
    return { totalDays, presentDays, percentage };
  };

  // Teacher Attendance
  const saveTeacherAttendance = (records: TeacherAttendanceRecord[]) => {
    if (records.length === 0) return;
    const targetDate = records[0].date;
    setTeacherAttendance((prev) => {
      const filtered = prev.filter((r) => r.date !== targetDate);
      return [...filtered, ...records];
    });
    addToast('success', `Teacher attendance saved for ${targetDate}`);
  };

  const getTeacherAttendanceForDate = (date: string) => {
    return teacherAttendance.filter((r) => r.date === date);
  };

  // Fee Management
  const addFeePayment = (feeData: Omit<FeePayment, 'id' | 'receiptNo'>): string => {
    const id = 'fp-' + Date.now();
    const seq = String(fees.length + 1).padStart(3, '0');
    const receiptNo = `${settings.receiptPrefix}${seq}`;
    const newFee: FeePayment = { ...feeData, id, receiptNo };
    setFees((prev) => [newFee, ...prev]);
    addToast('success', `Payment receipt ${receiptNo} generated for ₹${newFee.paidAmount.toLocaleString()}`);
    return id;
  };

  const updateFeePayment = (id: string, updated: Partial<FeePayment>) => {
    setFees((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated } : f))
    );
    addToast('success', 'Fee payment details updated');
  };

  const deleteFeePayment = (id: string) => {
    setFees((prev) => prev.filter((f) => f.id !== id));
    addToast('info', 'Fee record deleted');
  };

  // Exams & Marks
  const saveExamRecord = (examData: Omit<ExamRecord, 'id'> & { id?: string }) => {
    if (examData.id) {
      setExams((prev) =>
        prev.map((e) => (e.id === examData.id ? ({ ...e, ...examData } as ExamRecord) : e))
      );
      addToast('success', 'Exam record updated');
    } else {
      const id = 'exam-rec-' + Date.now();
      const newRecord: ExamRecord = { ...(examData as Omit<ExamRecord, 'id'>), id };
      setExams((prev) => [newRecord, ...prev]);
      addToast('success', 'Exam marks saved successfully');
    }
  };

  const deleteExamRecord = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    addToast('info', 'Exam record removed');
  };

  // Homework
  const addHomework = (hwData: Omit<Homework, 'id'>) => {
    const id = 'hw-' + Date.now();
    setHomework((prev) => [{ ...hwData, id }, ...prev]);
    addToast('success', `Homework assigned for Class ${hwData.class}`);
  };

  const updateHomework = (id: string, hwData: Partial<Homework>) => {
    setHomework((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...hwData } : h))
    );
    addToast('success', 'Homework updated');
  };

  const deleteHomework = (id: string) => {
    setHomework((prev) => prev.filter((h) => h.id !== id));
    addToast('info', 'Homework task deleted');
  };

  // Timetable
  const saveTimetableSlot = (slot: TimetableSlot) => {
    setTimetable((prev) => {
      const filtered = prev.filter(
        (s) =>
          !(
            s.day === slot.day &&
            s.period === slot.period &&
            s.class === slot.class &&
            s.division === slot.division
          )
      );
      return [...filtered, slot];
    });
    addToast('success', `Period ${slot.period} on ${slot.day} updated`);
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable((prev) => prev.filter((s) => s.id !== id));
    addToast('info', 'Timetable slot removed');
  };

  // Expenses
  const addExpense = (expenseData: Omit<SchoolExpense, 'id'>) => {
    const id = 'exp-' + Date.now();
    setExpenses((prev) => [{ ...expenseData, id }, ...prev]);
    addToast('success', `Expense of ₹${expenseData.amount.toLocaleString()} logged`);
  };

  const updateExpense = (id: string, expenseData: Partial<SchoolExpense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...expenseData } : e))
    );
    addToast('success', 'Expense updated');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    addToast('info', 'Expense deleted');
  };

  // Vehicles / Transport
  const addVehicle = (vehData: Omit<Vehicle, 'id'>) => {
    const id = 'v-' + Date.now();
    setVehicles((prev) => [...prev, { ...vehData, id }]);
    addToast('success', `Transport vehicle ${vehData.vehicleNumber} added`);
  };

  const updateVehicle = (id: string, vehData: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...vehData } : v))
    );
    addToast('success', 'Vehicle updated');
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    addToast('info', 'Vehicle removed');
  };

  // Notices
  const addNotice = (noticeData: Omit<SchoolNotice, 'id'>) => {
    const id = 'not-' + Date.now();
    setNotices((prev) => [{ ...noticeData, id }, ...prev]);
    addToast('success', 'School notice published');
  };

  const updateNotice = (id: string, noticeData: Partial<SchoolNotice>) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...noticeData } : n))
    );
    addToast('success', 'Notice updated');
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    addToast('info', 'Notice removed');
  };

  // Certificates
  const generateCertificate = (certData: Omit<CertificateData, 'id' | 'certificateNo'>): string => {
    const id = 'cert-' + Date.now();
    const typeCode = certData.certificateType.substring(0, 3).toUpperCase();
    const seq = String(certificates.length + 1).padStart(3, '0');
    const certificateNo = `SPS/${typeCode}/2026/${seq}`;
    const newCert: CertificateData = { ...certData, id, certificateNo };
    setCertificates((prev) => [newCert, ...prev]);
    addToast('success', `${certData.certificateType} generated (${certificateNo})`);
    return id;
  };

  const deleteCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'Certificate record deleted');
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.clear();
    setSettings(initialSettings);
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setStaff(initialStaff);
    setClasses(initialClasses);
    setAttendance(initialAttendance);
    setTeacherAttendance(initialTeacherAttendance);
    setFees(initialFeePayments);
    setExams(initialExamRecords);
    setHomework(initialHomework);
    setTimetable(initialTimetable);
    setExpenses(initialExpenses);
    setVehicles(initialVehicles);
    setNotices(initialNotices);
    setCertificates(initialCertificates);
    addToast('info', 'All application demo data reset to default successfully!');
  };

  // Export Data JSON
  const exportDataJson = (): string => {
    const fullBackup = {
      timestamp: new Date().toISOString(),
      settings,
      students,
      teachers,
      staff,
      classes,
      attendance,
      teacherAttendance,
      fees,
      exams,
      homework,
      timetable,
      expenses,
      vehicles,
      notices,
      certificates
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  // Import Data JSON
  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.settings) setSettings(data.settings);
      if (data.students) setStudents(data.students);
      if (data.teachers) setTeachers(data.teachers);
      if (data.staff) setStaff(data.staff);
      if (data.classes) setClasses(data.classes);
      if (data.attendance) setAttendance(data.attendance);
      if (data.teacherAttendance) setTeacherAttendance(data.teacherAttendance);
      if (data.fees) setFees(data.fees);
      if (data.exams) setExams(data.exams);
      if (data.homework) setHomework(data.homework);
      if (data.timetable) setTimetable(data.timetable);
      if (data.expenses) setExpenses(data.expenses);
      if (data.vehicles) setVehicles(data.vehicles);
      if (data.notices) setNotices(data.notices);
      if (data.certificates) setCertificates(data.certificates);
      addToast('success', 'Backup data restored successfully!');
      return true;
    } catch (e) {
      console.error(e);
      addToast('error', 'Failed to parse JSON backup file');
      return false;
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        settings,
        updateSettings,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        classes,
        addClass,
        updateClass,
        deleteClass,
        attendance,
        saveStudentAttendance,
        getStudentAttendanceForDate,
        getStudentAttendanceStats,
        teacherAttendance,
        saveTeacherAttendance,
        getTeacherAttendanceForDate,
        fees,
        addFeePayment,
        updateFeePayment,
        deleteFeePayment,
        exams,
        saveExamRecord,
        deleteExamRecord,
        homework,
        addHomework,
        updateHomework,
        deleteHomework,
        timetable,
        saveTimetableSlot,
        deleteTimetableSlot,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        notices,
        addNotice,
        updateNotice,
        deleteNotice,
        certificates,
        generateCertificate,
        deleteCertificate,
        toasts,
        addToast,
        removeToast,
        resetDemoData,
        exportDataJson,
        importDataJson,
        activeView,
        setActiveView,
        selectedStudentIdForProfile,
        setSelectedStudentIdForProfile,
        selectedReceiptIdForPrint,
        setSelectedReceiptIdForPrint
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
