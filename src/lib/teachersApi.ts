import api from './api';

/** Mirrors the backend's CreateTeacherDto (teachers/dto/create-teacher.dto.ts). */
export interface CreateTeacherPayload {
  teacher: {
    name: string;
    mobileNumber: string;
    alternateMobile?: string;
    email?: string;
    employeeCode: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    dob?: string;
    bloodGroup?: string;
    aadhaar?: string;
    department?: string;
    designation?: string;
    subjects?: string[];
    employeeType?: string;
    joiningDate?: string;
    experienceYears?: number;
    qualification?: string;
    previousSchool?: string;
    salary?: number;
    academicYear?: string;
  };
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
}

export interface TeacherListItem {
  id: string;
  displayId: string;
  employeeCode: string;
  name: string;
  mobileNumber: string;
  email: string | null;
  department: string | null;
  designation: string | null;
  subjects: string[];
  status: string;
  joiningDate: string;
}

/** Full detail for the edit dialog — the raw record shape GET /teachers/:id returns. */
export interface TeacherDetail {
  id: string;
  displayId: string;
  employeeCode: string;
  qualification: string | null;
  subjects: string[];
  joiningDate: string;
  status: string;
  gender: string | null;
  dob: string | null;
  bloodGroup: string | null;
  aadhaar: string | null;
  alternateMobile: string | null;
  department: string | null;
  designation: string | null;
  employeeType: string | null;
  experienceYears: number | null;
  previousSchool: string | null;
  /** Prisma Decimal serializes to a string. */
  salary: string | null;
  academicYear: string | null;
  user: { id: string; name: string; mobileNumber: string; email: string | null; status: string };
  address: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    pincode: string | null;
  } | null;
}

export async function fetchTeachers(): Promise<TeacherListItem[]> {
  const { data } = await api.get<TeacherListItem[]>('/teachers');
  return data;
}

export async function fetchTeacher(id: string): Promise<TeacherDetail> {
  const { data } = await api.get<TeacherDetail>(`/teachers/${id}`);
  return data;
}

// The mutations below are deliberately not `silent` — the global toast shows the
// API's own `message` field, success and error alike.

export async function createTeacher(
  payload: CreateTeacherPayload,
): Promise<{ message: string; teacher: TeacherListItem }> {
  const { data } = await api.post<{ message: string; teacher: TeacherListItem }>(
    '/teachers',
    payload,
  );
  return data;
}

export async function updateTeacher(
  id: string,
  payload: CreateTeacherPayload,
): Promise<{ message: string; teacher: TeacherListItem }> {
  const { data } = await api.patch<{ message: string; teacher: TeacherListItem }>(
    `/teachers/${id}`,
    payload,
  );
  return data;
}

export async function deleteTeacher(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/teachers/${id}`);
  return data;
}
