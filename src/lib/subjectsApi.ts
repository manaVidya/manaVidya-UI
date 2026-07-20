import api from './api';

export type SubjectCategory =
  'LANGUAGE' | 'CORE' | 'SCIENCE' | 'SOCIAL' | 'ELECTIVE' | 'CO_SCHOLASTIC';

/** Mirrors the backend's CreateSubjectDto (subjects/dto/create-subject.dto.ts) — same shape for create and update. */
export interface SubjectPayload {
  name: string;
  code: string;
  category: SubjectCategory;
  languageOrder?: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface SubjectListItem {
  id: string;
  name: string;
  code: string;
  category: SubjectCategory;
  languageOrder: number | null;
  displayOrder: number;
  isActive: boolean;
}

export async function fetchSubjects(): Promise<SubjectListItem[]> {
  const { data } = await api.get<SubjectListItem[]>('/subjects');
  return data;
}

export async function createSubject(
  payload: SubjectPayload,
): Promise<{ message: string; subject: SubjectListItem }> {
  const { data } = await api.post<{ message: string; subject: SubjectListItem }>(
    '/subjects',
    payload,
  );
  return data;
}

export async function updateSubject(
  id: string,
  payload: SubjectPayload,
): Promise<{ message: string; subject: SubjectListItem }> {
  const { data } = await api.patch<{ message: string; subject: SubjectListItem }>(
    `/subjects/${id}`,
    payload,
  );
  return data;
}
