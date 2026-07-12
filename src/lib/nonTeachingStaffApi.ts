import api from './api';

/** Mirrors the backend's CreateNonTeachingStaffDto (non-teaching-staff/dto/...) — same shape for create and update. */
export interface CreateNonTeachingStaffPayload {
  staff: {
    name: string;
    mobileNumber: string;
    alternateMobile?: string;
    email?: string;
    employeeCode: string;
    designation: string;
    department?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    dob?: string;
    bloodGroup?: string;
    aadhaar?: string;
    employeeType?: string;
    joiningDate?: string;
    experienceYears?: number;
    salary?: number;
    profilePhotoUrl?: string;
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

export interface NonTeachingStaffListItem {
  id: string;
  displayId: string;
  employeeCode: string;
  name: string;
  mobileNumber: string;
  email: string | null;
  designation: string;
  department: string | null;
  status: string;
  joiningDate: string;
}

/** Full detail for the edit dialog — the raw record shape GET /non-teaching-staff/:id returns. */
export interface NonTeachingStaffDetail {
  id: string;
  displayId: string;
  employeeCode: string;
  name: string;
  mobileNumber: string;
  alternateMobile: string | null;
  email: string | null;
  designation: string;
  department: string | null;
  status: string;
  gender: string | null;
  dob: string | null;
  bloodGroup: string | null;
  aadhaar: string | null;
  employeeType: string | null;
  joiningDate: string;
  experienceYears: number | null;
  /** Prisma Decimal serializes to a string. */
  salary: string | null;
  profilePhotoUrl: string | null;
  address: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    pincode: string | null;
  } | null;
}

export async function fetchNonTeachingStaff(): Promise<NonTeachingStaffListItem[]> {
  const { data } = await api.get<NonTeachingStaffListItem[]>('/non-teaching-staff');
  return data;
}

export async function fetchNonTeachingStaffMember(id: string): Promise<NonTeachingStaffDetail> {
  const { data } = await api.get<NonTeachingStaffDetail>(`/non-teaching-staff/${id}`);
  return data;
}

// The mutations below are deliberately not `silent` — the global toast shows the
// API's own `message` field, success and error alike.

export async function createNonTeachingStaff(
  payload: CreateNonTeachingStaffPayload,
): Promise<{ message: string; staff: NonTeachingStaffListItem }> {
  const { data } = await api.post<{ message: string; staff: NonTeachingStaffListItem }>(
    '/non-teaching-staff',
    payload,
  );
  return data;
}

export async function updateNonTeachingStaff(
  id: string,
  payload: CreateNonTeachingStaffPayload,
): Promise<{ message: string; staff: NonTeachingStaffListItem }> {
  const { data } = await api.patch<{ message: string; staff: NonTeachingStaffListItem }>(
    `/non-teaching-staff/${id}`,
    payload,
  );
  return data;
}

export async function deleteNonTeachingStaff(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/non-teaching-staff/${id}`);
  return data;
}
