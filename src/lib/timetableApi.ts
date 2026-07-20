import api from './api';

export type DayOfWeek =
  'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface TimetableEntryPayload {
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  subject: string;
  teacherId?: string;
  startTime: string;
  endTime: string;
}

export interface TimetableEntry {
  id: string;
  classId: string;
  class: { id: string; name: string; section: string };
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  subject: string;
  startTime: string;
  endTime: string;
  teacher: { id: string; displayId: string; name: string } | null;
}

export interface BulkSaveTimetablePayload {
  classId: string;
  academicYear?: string;
  entries: TimetableEntryPayload[];
}

export async function fetchClassTimetable(
  classId: string,
  academicYear?: string,
): Promise<TimetableEntry[]> {
  const { data } = await api.get<TimetableEntry[]>(`/timetable/class/${classId}`, {
    params: academicYear ? { academicYear } : undefined,
  });
  return data;
}

export async function fetchMyTimetable(
  portal: 'teacher' | 'student' | 'parent',
  childId?: string,
): Promise<TimetableEntry[]> {
  const { data } = await api.get<TimetableEntry[]>('/timetable/me', {
    params: { portal, ...(childId ? { childId } : {}) },
  });
  return data;
}

export async function bulkSaveTimetable(
  payload: BulkSaveTimetablePayload,
): Promise<{ message: string; timetable: TimetableEntry[] }> {
  const { data } = await api.post<{ message: string; timetable: TimetableEntry[] }>(
    '/timetable/bulk',
    payload,
  );
  return data;
}
