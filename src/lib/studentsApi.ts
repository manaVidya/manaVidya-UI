import api from './api';

/** Mirrors the backend's CreateStudentDto (students/dto/create-student.dto.ts). */
export interface CreateStudentPayload {
  student: {
    name: string;
    mobileNumber: string;
    email?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    dob: string;
    className: string;
    section: string;
    academicYear?: string;
    admissionNo: string;
    admissionDate?: string;
    rollNo: string;
    bloodGroup?: string;
    house?: string;
    mediumOfInstruction?: string;
    previousSchool?: string;
  };
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  medical?: {
    heightCm?: number;
    weightKg?: number;
    allergies?: string;
    medicalConditions?: string;
    disability?: boolean;
    doctorName?: string;
    emergencyMedicalNotes?: string;
    emergencyContactPhone?: string;
  };
  identity?: {
    aadhaar?: string;
    birthCertificateNumber?: string;
    passportNumber?: string;
  };
  transport?: {
    required?: boolean;
    route?: string;
    busNumber?: string;
    pickupPoint?: string;
  };
  guardians: {
    name: string;
    mobileNumber: string;
    email?: string;
    relation: 'FATHER' | 'MOTHER' | 'GUARDIAN';
    isPrimary?: boolean;
  }[];
}

export interface StudentGuardianSummary {
  userId: string;
  name: string;
  mobileNumber: string;
  email: string | null;
  relation: string;
  isPrimary: boolean;
}

export interface StudentListItem {
  id: string;
  displayId: string;
  name: string;
  className: string;
  section: string;
  rollNo: string;
  dob: string;
  gender: string | null;
  bloodGroup: string | null;
  admissionNo: string;
  status: string;
  guardianName: string;
  guardianPhone: string;
  guardians: StudentGuardianSummary[];
}

export async function fetchStudents(): Promise<StudentListItem[]> {
  const { data } = await api.get<StudentListItem[]>('/students');
  return data;
}

/** Full detail for the edit dialog — the raw record shape GET /students/:id returns,
 *  including the side tables the list view omits. */
export interface StudentDetail {
  id: string;
  displayId: string;
  name: string;
  admissionNo: string;
  admissionDate: string;
  rollNo: string;
  dob: string;
  gender: string | null;
  bloodGroup: string | null;
  status: string;
  academicYear: string | null;
  house: string | null;
  mediumOfInstruction: string | null;
  previousSchool: string | null;
  class: { name: string; section: string };
  user: { id: string; mobileNumber: string; email: string | null; status: string } | null;
  guardians: {
    relation: string;
    isPrimary: boolean;
    guardianUser: { id: string; name: string; mobileNumber: string; email: string | null };
  }[];
  address: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    pincode: string | null;
  } | null;
  medicalInfo: {
    heightCm: number | null;
    weightKg: number | null;
    allergies: string | null;
    medicalConditions: string | null;
    disability: boolean;
    doctorName: string | null;
    emergencyMedicalNotes: string | null;
    emergencyContactPhone: string | null;
  } | null;
  identityDoc: {
    aadhaar: string | null;
    birthCertificateNumber: string | null;
    passportNumber: string | null;
  } | null;
  transport: {
    required: boolean;
    route: string | null;
    busNumber: string | null;
    pickupPoint: string | null;
  } | null;
}

export async function fetchStudent(id: string): Promise<StudentDetail> {
  const { data } = await api.get<StudentDetail>(`/students/${id}`);
  return data;
}

// The mutations below are deliberately not `silent` — the global toast shows the
// API's own `message` field ("Student MVSTUxxxx created. ..."), success and error alike.

export async function createStudent(
  payload: CreateStudentPayload,
): Promise<{ message: string; student: StudentListItem }> {
  const { data } = await api.post<{ message: string; student: StudentListItem }>(
    '/students',
    payload,
  );
  return data;
}

export async function updateStudent(
  id: string,
  payload: CreateStudentPayload,
): Promise<{ message: string; student: StudentListItem }> {
  const { data } = await api.patch<{ message: string; student: StudentListItem }>(
    `/students/${id}`,
    payload,
  );
  return data;
}

export async function deleteStudent(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/students/${id}`);
  return data;
}
