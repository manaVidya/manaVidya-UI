import api from './api';

export type ExamType = 'UNIT_TEST' | 'MID_TERM' | 'FINAL' | 'OTHER';

/** Mirrors the backend's CreateExamDto (exams/dto/create-exam.dto.ts) — same shape for create and update. */
export interface ExamPayload {
  name: string;
  examType: ExamType;
  academicYear?: string;
  startDate: string;
  endDate: string;
}

export interface ExamListItem {
  id: string;
  name: string;
  examType: ExamType;
  academicYear: string;
  startDate: string;
  endDate: string;
}

export async function fetchExams(academicYear?: string): Promise<ExamListItem[]> {
  const { data } = await api.get<ExamListItem[]>('/exams', {
    params: academicYear ? { academicYear } : undefined,
  });
  return data;
}

export async function createExam(
  payload: ExamPayload,
): Promise<{ message: string; exam: ExamListItem }> {
  const { data } = await api.post<{ message: string; exam: ExamListItem }>('/exams', payload);
  return data;
}

export async function updateExam(
  id: string,
  payload: ExamPayload,
): Promise<{ message: string; exam: ExamListItem }> {
  const { data } = await api.patch<{ message: string; exam: ExamListItem }>(
    `/exams/${id}`,
    payload,
  );
  return data;
}

export async function deleteExam(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/exams/${id}`);
  return data;
}

export interface ExamScheduleEntryPayload {
  subject: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  roomNo?: string;
}

export interface ExamScheduleEntry {
  id: string;
  classId: string;
  subject: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  roomNo: string | null;
}

export async function fetchExamSchedule(
  examId: string,
  classId: string,
): Promise<ExamScheduleEntry[]> {
  const { data } = await api.get<ExamScheduleEntry[]>(`/exams/${examId}/schedule/class/${classId}`);
  return data;
}

export async function fetchMyExamSchedule(
  examId: string,
  portal: 'student' | 'parent',
  childId?: string,
): Promise<ExamScheduleEntry[]> {
  const { data } = await api.get<ExamScheduleEntry[]>(`/exams/${examId}/schedule/me`, {
    params: { portal, ...(childId ? { childId } : {}) },
  });
  return data;
}

export async function bulkSaveExamSchedule(
  examId: string,
  classId: string,
  entries: ExamScheduleEntryPayload[],
): Promise<{ message: string; schedule: ExamScheduleEntry[] }> {
  const { data } = await api.post<{ message: string; schedule: ExamScheduleEntry[] }>(
    `/exams/${examId}/schedule/bulk`,
    { classId, entries },
  );
  return data;
}

export async function downloadExamTimetablePdf(examId: string, classId: string): Promise<Blob> {
  const { data } = await api.get<Blob>(`/exams/${examId}/schedule/class/${classId}/pdf`, {
    responseType: 'blob',
  });
  return data;
}

export interface HallTicketListItem {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  displayId: string;
  className: string;
  section: string;
  ticketNo: string;
  examCenter: string | null;
  seatNo: string | null;
}

export async function generateHallTickets(
  examId: string,
  classId: string,
  examCenter?: string,
): Promise<{ message: string; hallTickets: HallTicketListItem[] }> {
  const { data } = await api.post<{ message: string; hallTickets: HallTicketListItem[] }>(
    `/exams/${examId}/hall-tickets/generate`,
    { classId, examCenter },
  );
  return data;
}

export async function fetchHallTickets(
  examId: string,
  classId: string,
): Promise<HallTicketListItem[]> {
  const { data } = await api.get<HallTicketListItem[]>(`/exams/${examId}/hall-tickets`, {
    params: { classId },
  });
  return data;
}

export async function downloadHallTicketPdf(examId: string, studentId: string): Promise<Blob> {
  const { data } = await api.get<Blob>(`/exams/${examId}/hall-tickets/${studentId}/pdf`, {
    responseType: 'blob',
  });
  return data;
}

export async function downloadMyHallTicketPdf(
  examId: string,
  portal: 'student' | 'parent',
  childId?: string,
): Promise<Blob> {
  const { data } = await api.get<Blob>(`/exams/${examId}/hall-tickets/me/pdf`, {
    params: { portal, ...(childId ? { childId } : {}) },
    responseType: 'blob',
  });
  return data;
}
