import api from './api';

/** One subject in the class curriculum, with its own optional subject teacher. */
export interface ClassSubjectPayload {
  subject: string;
  teacherId?: string;
}

export interface ClassSubjectItem {
  subject: string;
  teacher: { id: string; displayId: string; name: string } | null;
}

/** Mirrors the backend's CreateClassDto (classes/dto/create-class.dto.ts) — same shape for create and update. */
export interface ClassPayload {
  name: string;
  section: string;
  academicYear?: string;
  capacity?: number;
  classTeacherId?: string;
  subjects?: ClassSubjectPayload[];
}

export interface ClassListItem {
  id: string;
  name: string;
  section: string;
  academicYear: string;
  capacity: number | null;
  subjects: ClassSubjectItem[];
  studentCount: number;
  classTeacher: { id: string; displayId: string; name: string } | null;
}

export async function fetchClasses(): Promise<ClassListItem[]> {
  const { data } = await api.get<ClassListItem[]>('/classes');
  return data;
}

export async function fetchClass(id: string): Promise<ClassListItem> {
  const { data } = await api.get<ClassListItem>(`/classes/${id}`);
  return data;
}

// The mutations below are deliberately not `silent` — the global toast shows the
// API's own `message` field, success and error alike (e.g. the 409 when a class
// teacher is already leading another class, or the 400 blocking delete while
// students are still enrolled).

export async function createClass(
  payload: ClassPayload,
): Promise<{ message: string; class: ClassListItem }> {
  const { data } = await api.post<{ message: string; class: ClassListItem }>('/classes', payload);
  return data;
}

export async function updateClass(
  id: string,
  payload: ClassPayload,
): Promise<{ message: string; class: ClassListItem }> {
  const { data } = await api.patch<{ message: string; class: ClassListItem }>(
    `/classes/${id}`,
    payload,
  );
  return data;
}

export async function deleteClass(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/classes/${id}`);
  return data;
}
