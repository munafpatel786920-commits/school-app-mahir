export type Role = 'Admin' | 'Principal' | 'Teacher' | 'Accountant' | 'Staff';

export type Language = 'en' | 'gu';

export type StudentStatus = 'Active' | 'Inactive';
export type TeacherStatus = 'Active' | 'On Leave' | 'Resigned';
export type StaffStatus = 'Active' | 'On Leave' | 'Resigned';

export type FeeType = 
  | 'Tuition Fee' 
  | 'Admission Fee' 
  | 'Exam Fee' 
  | 'Computer Fee' 
  | 'Transport Fee' 
  | 'Other Fee';

export type PaymentMode = 'Cash' | 'UPI/Online' | 'Cheque' | 'Bank Transfer';

export type ExamType = 'Unit Test' | 'Semester 1' | 'Semester 2' | 'Final Exam';

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave';

export type NoticeType = 'General' | 'Academic' | 'Holiday' | 'Exam' | 'Sports';

export type ExpenseCategory = 
  | 'Electricity' 
  | 'Salary' 
  | 'Stationery' 
  | 'Maintenance' 
  | 'Transport' 
  | 'Rent' 
  | 'Other';

export type CertificateType = 
  | 'Bonafide Certificate' 
  | 'Leaving Certificate' 
  | 'Character Certificate' 
  | 'Study Certificate' 
  | 'Fee Certificate';

export interface Student {
  id: string;
  admissionNo: string;
  name: string;
  nameGu?: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  parentMobile: string;
  address: string;
  city: string;
  state: string;
  bloodGroup: string;
  aadhaarNumber: string;
  class: string;
  division: string;
  rollNumber: number;
  admissionDate: string;
  previousSchool: string;
  photoUrl: string;
  status: StudentStatus;
  busRoute?: string;
}

export interface Teacher {
  id: string;
  teacherId: string;
  name: string;
  fatherName: string;
  mobile: string;
  email: string;
  address: string;
  dob: string;
  qualification: string;
  subject: string;
  joiningDate: string;
  salary: number;
  photoUrl: string;
  status: TeacherStatus;
}

export interface Staff {
  id: string;
  staffId: string;
  name: string;
  mobile: string;
  address: string;
  position: 'Accountant' | 'Clerk' | 'Peon' | 'Driver' | 'Security' | 'Librarian' | 'Other';
  joiningDate: string;
  salary: number;
  status: StaffStatus;
}

export interface ClassDefinition {
  id: string;
  name: string; // e.g. "1st", "10th", "Nursery"
  divisions: string[]; // ["A", "B", "C"]
  classTeacher?: string; // Teacher name or ID
  subjects: string[];
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  class: string;
  division: string;
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface TeacherAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  teacherId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  class: string;
  division: string;
  academicYear: string;
  feeType: FeeType;
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  paymentDate: string;
  paymentMode: PaymentMode;
  remarks: string;
}

export interface ExamSubjectMark {
  subject: string;
  maxMarks: number;
  passingMarks: number;
  obtainedMarks: number;
}

export interface ExamRecord {
  id: string;
  examType: ExamType;
  academicYear: string;
  studentId: string;
  class: string;
  division: string;
  subjects: ExamSubjectMark[];
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  grade: string;
  isPassed: boolean;
  rank?: number;
  teacherRemarks: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  class: string;
  division: string;
  subject: string;
  teacher: string;
  assignedDate: string;
  dueDate: string;
  status: 'Active' | 'Submitted' | 'Closed';
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number; // 1 to 8
  time: string;
  class: string;
  division: string;
  subject: string;
  teacher: string;
  roomNumber: string;
}

export interface SchoolExpense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMode: PaymentMode;
  paidTo: string;
  remarks: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverMobile: string;
  route: string;
  capacity: number;
  transportFee: number;
  assignedStudentsCount: number;
}

export interface SchoolNotice {
  id: string;
  title: string;
  description: string;
  date: string;
  type: NoticeType;
  publishedBy: string;
  important: boolean;
}

export interface SchoolSettings {
  schoolName: string;
  schoolNameGu: string;
  schoolTagline: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  principalName: string;
  principalSignatureText: string;
  academicYear: string;
  receiptPrefix: string;
  currencySymbol: string;
  affiliationNo: string;
}

export interface CertificateData {
  id: string;
  certificateNo: string;
  certificateType: CertificateType;
  studentId: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  class: string;
  division: string;
  academicYear: string;
  issueDate: string;
  reason: string;
  conductRemarks: string;
}
