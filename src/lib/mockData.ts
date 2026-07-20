/**
 * Dev-only dummy data for every portal page. Nothing here is wired to a
 * backend yet (see the spec's Scope Note) — this exists purely so every
 * nav route in lib/navigationConfig.ts has something real-looking to render
 * instead of a blank page.
 */
import type { ChildSummary } from '../types/rbac';

export const MOCK_CHILDREN: ChildSummary[] = [
  {
    id: 'child-1',
    classId: 'class-5a',
    name: 'Aditya Reddy',
    className: '5',
    section: 'A',
    rollNo: '12',
    dob: '2016-03-14',
    bloodGroup: 'B+',
    attendancePct: 94,
  },
  {
    id: 'child-2',
    classId: 'class-2b',
    name: 'Sneha Reddy',
    className: '2',
    section: 'B',
    rollNo: '07',
    dob: '2019-07-02',
    bloodGroup: 'B+',
    attendancePct: 97,
  },
];

export interface StudentRow {
  id: string;
  name: string;
  className: string;
  section: string;
  rollNo: string;
  attendancePct: number;
  guardianPhone: string;

  // 1. Student Information
  studentId?: string;
  gender?: string;
  dob?: string;
  admissionNumber?: string;
  admissionDate?: string;
  bloodGroup?: string;
  profilePhoto?: string;

  // 2. Parent Information
  fatherName?: string;
  motherName?: string;
  fatherPhone?: string;
  motherPhone?: string;
  parentEmail?: string;
  guardianName?: string;
  guardianRelationship?: string;
  emergencyContact?: string;

  // 3. Address
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;

  // 4. Academic Information
  academicYear?: string;
  previousSchool?: string;
  mediumOfInstruction?: string;
  house?: string;
  studentStatus?: string;

  // 5. Medical Information
  age?: number;
  heightCm?: number;
  weightKg?: number;
  allergies?: string;
  medicalConditions?: string;
  disability?: boolean;
  doctorName?: string;
  emergencyMedicalNotes?: string;

  // 6. Identity Details
  aadhaar?: string;
  birthCertificateNumber?: string;
  passportNumber?: string;

  // 7. Transport
  transportRequired?: boolean;
  route?: string;
  busNumber?: string;
  pickupPoint?: string;

  // 8. Fee Information
  feeCategory?: string;
  scholarship?: string;
  feeConcession?: string;
  paymentStatus?: string;

  // 9. Login Information
  username?: string;
  password?: string;
  email?: string;
  accountStatus?: string;

  // 10. Documents
  aadhaarDoc?: string;
  birthCertificate?: string;
  transferCertificate?: string;
  previousMarksMemo?: string;
  medicalCertificate?: string;
}

export const MOCK_STUDENTS: StudentRow[] = [
  {
    id: 'stu-1',
    name: 'Aditya Reddy',
    className: '5',
    section: 'A',
    rollNo: '12',
    attendancePct: 94,
    guardianPhone: '+91 90000 00001',
  },
  {
    id: 'stu-2',
    name: 'Bhanu Prasad',
    className: '5',
    section: 'A',
    rollNo: '13',
    attendancePct: 88,
    guardianPhone: '+91 90000 00002',
  },
  {
    id: 'stu-3',
    name: 'Chitra Devi',
    className: '5',
    section: 'A',
    rollNo: '14',
    attendancePct: 99,
    guardianPhone: '+91 90000 00003',
  },
  {
    id: 'stu-4',
    name: 'Deepak Kumar',
    className: '5',
    section: 'A',
    rollNo: '15',
    attendancePct: 76,
    guardianPhone: '+91 90000 00004',
  },
  {
    id: 'stu-5',
    name: 'Esha Sharma',
    className: '5',
    section: 'A',
    rollNo: '16',
    attendancePct: 91,
    guardianPhone: '+91 90000 00005',
  },
  {
    id: 'stu-6',
    name: 'Farhan Ali',
    className: '5',
    section: 'A',
    rollNo: '17',
    attendancePct: 85,
    guardianPhone: '+91 90000 00006',
  },
];

export interface TeacherRow {
  id: string;
  name: string;
  subject: string;
  classesAssigned: string;
  phone: string;
}

export interface TeacherProfile {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  bloodGroup?: string;
  aadhaar?: string;
  profilePhoto?: string;
  mobile: string;
  alternateMobile?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  department: string;
  designation: string;
  subjects: string[];
  employeeType: string;
  joiningDate?: string;
  experience?: number;
  qualification?: string;
  previousSchool?: string;
  salary?: number;
  employmentStatus: string;
  classes: string[];
  sections: string[];
  classTeacher: boolean;
  subjectsAssigned: string[];
  academicYear: string;
}

export function toTeacherRow(profile: TeacherProfile): TeacherRow {
  const classesAssigned =
    profile.classes.length > 0
      ? profile.classes.map((cls, i) => `${cls}-${profile.sections[i] || ''}`).join(', ')
      : '—';
  return {
    id: profile.id,
    name: `${profile.firstName} ${profile.lastName}`,
    subject: profile.subjects.join(', ') || '—',
    classesAssigned,
    phone: profile.mobile,
  };
}

export const MOCK_TEACHERS: TeacherRow[] = [
  {
    id: 'tch-1',
    name: 'K. Lakshmi',
    subject: 'Mathematics',
    classesAssigned: '5-A, 6-B',
    phone: '+91 90111 00001',
  },
  {
    id: 'tch-2',
    name: 'R. Venkatesh',
    subject: 'Science',
    classesAssigned: '5-A, 5-B',
    phone: '+91 90111 00002',
  },
  {
    id: 'tch-3',
    name: 'S. Anitha',
    subject: 'Telugu',
    classesAssigned: '4-A, 5-A',
    phone: '+91 90111 00003',
  },
  {
    id: 'tch-4',
    name: 'M. Suresh',
    subject: 'English',
    classesAssigned: '5-A, 7-A',
    phone: '+91 90111 00004',
  },
  {
    id: 'tch-5',
    name: 'P. Kavitha',
    subject: 'Social Studies',
    classesAssigned: '6-A, 6-B',
    phone: '+91 90111 00005',
  },
];

export interface ClassRow {
  id: string;
  name: string;
  section: string;
  classTeacher: string;
  studentCount: number;
}

export const MOCK_CLASSES: ClassRow[] = [
  { id: 'cls-1', name: '5', section: 'A', classTeacher: 'K. Lakshmi', studentCount: 42 },
  { id: 'cls-2', name: '5', section: 'B', classTeacher: 'R. Venkatesh', studentCount: 39 },
  { id: 'cls-3', name: '6', section: 'A', classTeacher: 'P. Kavitha', studentCount: 44 },
  { id: 'cls-4', name: '6', section: 'B', classTeacher: 'P. Kavitha', studentCount: 40 },
  { id: 'cls-5', name: '7', section: 'A', classTeacher: 'M. Suresh', studentCount: 37 },
];

export interface TimetablePeriod {
  time: string;
  subjects: (string | null)[]; // Mon..Sat
}

export const TIMETABLE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MOCK_TIMETABLE: TimetablePeriod[] = [
  { time: '9:00', subjects: ['Telugu', 'Maths', 'Science', 'English', 'Maths', 'PE'] },
  { time: '9:45', subjects: ['Maths', 'Telugu', 'English', 'Science', 'Social', 'Art'] },
  { time: '10:30', subjects: ['Science', 'English', 'Maths', 'Telugu', 'English', 'Library'] },
  { time: '11:15', subjects: ['Break', 'Break', 'Break', 'Break', 'Break', 'Break'] },
  { time: '11:45', subjects: ['Social', 'Science', 'Telugu', 'Maths', 'Science', null] },
  { time: '12:30', subjects: ['English', 'Social', 'PE', 'Social', 'Telugu', null] },
];

export interface SyllabusTopic {
  subject: string;
  topic: string;
  completionPct: number;
}

export const MOCK_SYLLABUS: SyllabusTopic[] = [
  { subject: 'Mathematics', topic: 'Fractions & Decimals', completionPct: 80 },
  { subject: 'Science', topic: 'Living & Non-living Things', completionPct: 65 },
  { subject: 'Telugu', topic: 'పద్యాలు (Verses) — Chapter 4', completionPct: 90 },
  { subject: 'English', topic: 'Grammar — Tenses', completionPct: 45 },
  { subject: 'Social Studies', topic: 'Maps & Directions', completionPct: 70 },
];

export interface AssignmentRow {
  id: string;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  submissions?: string; // e.g. "34/42" — teacher/admin view
}

export const MOCK_ASSIGNMENTS: AssignmentRow[] = [
  {
    id: 'asg-1',
    title: 'Fractions worksheet',
    subject: 'Mathematics',
    className: '5-A',
    dueDate: '2026-07-12',
    status: 'pending',
    submissions: '18/42',
  },
  {
    id: 'asg-2',
    title: 'Plant life cycle poster',
    subject: 'Science',
    className: '5-A',
    dueDate: '2026-07-10',
    status: 'submitted',
    submissions: '42/42',
  },
  {
    id: 'asg-3',
    title: 'పద్యం అభ్యాసం (Verse practice)',
    subject: 'Telugu',
    className: '5-A',
    dueDate: '2026-07-15',
    status: 'pending',
    submissions: '5/42',
  },
  {
    id: 'asg-4',
    title: 'Essay: My Village',
    subject: 'English',
    className: '5-A',
    dueDate: '2026-07-08',
    status: 'graded',
    submissions: '42/42',
  },
];

export interface ResultRow {
  subject: string;
  marks: number;
  outOf: number;
  grade: string;
}

export const MOCK_RESULTS: ResultRow[] = [
  { subject: 'Mathematics', marks: 88, outOf: 100, grade: 'A' },
  { subject: 'Science', marks: 76, outOf: 100, grade: 'B+' },
  { subject: 'Telugu', marks: 92, outOf: 100, grade: 'A+' },
  { subject: 'English', marks: 81, outOf: 100, grade: 'A' },
  { subject: 'Social Studies', marks: 79, outOf: 100, grade: 'B+' },
];

export interface ExamRow {
  id: string;
  subject: string;
  date: string;
  time: string;
  room: string;
}

export const MOCK_EXAM_TIMETABLE: ExamRow[] = [
  { id: 'ex-1', subject: 'Mathematics', date: '2026-07-20', time: '10:00 – 12:00', room: 'Room 3' },
  { id: 'ex-2', subject: 'Science', date: '2026-07-22', time: '10:00 – 12:00', room: 'Room 3' },
  { id: 'ex-3', subject: 'Telugu', date: '2026-07-24', time: '10:00 – 12:00', room: 'Room 3' },
  { id: 'ex-4', subject: 'English', date: '2026-07-26', time: '10:00 – 12:00', room: 'Room 3' },
];

export interface NotificationRow {
  id: string;
  title: string;
  body: string;
  date: string;
  priority: 'high' | 'normal';
}

export const MOCK_NOTIFICATIONS: NotificationRow[] = [
  {
    id: 'ntf-1',
    title: 'Half-yearly exams begin July 20',
    body: 'Hall tickets will be issued from July 15.',
    date: '2026-07-05',
    priority: 'high',
  },
  {
    id: 'ntf-2',
    title: 'Independence Day rehearsal',
    body: 'All students to assemble in the courtyard at 9 AM.',
    date: '2026-07-06',
    priority: 'normal',
  },
  {
    id: 'ntf-3',
    title: 'Fee payment reminder',
    body: 'Term 2 fees are due by July 31.',
    date: '2026-07-03',
    priority: 'normal',
  },
];

export interface ChatbotFaq {
  id: string;
  question: string;
  answer: string;
}

export const MOCK_CHATBOT_FAQS: ChatbotFaq[] = [
  {
    id: 'faq-1',
    question: 'When is the next holiday?',
    answer: 'The school is closed on July 17 for a local festival.',
  },
  {
    id: 'faq-2',
    question: 'How do I download the hall ticket?',
    answer: 'Go to Exams & Hall Ticket and tap Download PDF.',
  },
  {
    id: 'faq-3',
    question: 'Who do I contact about fees?',
    answer: 'The school office is reachable at +91 8XXXX XXXXX, 9 AM–4 PM.',
  },
];

export const MOCK_SCHOOL_SETTINGS = {
  schoolName: 'Z.P. High School',
  circle: 'ManaVidya Pilot Circle',
  academicYear: '2026–27',
  address: 'Main Road, Mandal HQ, Andhra Pradesh',
  principal: 'Dr. N. Ramesh Babu',
  studentStrength: 842,
  teacherStrength: 46,
};

export interface FeeRow {
  term: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'due';
}

export const MOCK_FEES: FeeRow[] = [
  { term: 'Term 1', amount: 2500, dueDate: '2026-04-30', status: 'paid' },
  { term: 'Term 2', amount: 2500, dueDate: '2026-07-31', status: 'due' },
];

export interface HallTicketRow {
  id: string;
  studentName: string;
  rollNo: string;
  examCenter: string;
  seatNo: string;
}

export const MOCK_HALL_TICKETS: HallTicketRow[] = MOCK_STUDENTS.map((s, i) => ({
  id: s.id,
  studentName: s.name,
  rollNo: s.rollNo,
  examCenter: 'Z.P. High School — Main Block',
  seatNo: `S-${(100 + i).toString()}`,
}));

export interface ClassAttendanceRow {
  id: string;
  className: string;
  section: string;
  presentToday: number;
  totalStudents: number;
}

export const MOCK_CLASS_ATTENDANCE: ClassAttendanceRow[] = [
  { id: 'ca-1', className: '5', section: 'A', presentToday: 40, totalStudents: 42 },
  { id: 'ca-2', className: '5', section: 'B', presentToday: 35, totalStudents: 39 },
  { id: 'ca-3', className: '6', section: 'A', presentToday: 41, totalStudents: 44 },
  { id: 'ca-4', className: '6', section: 'B', presentToday: 38, totalStudents: 40 },
  { id: 'ca-5', className: '7', section: 'A', presentToday: 34, totalStudents: 37 },
];
