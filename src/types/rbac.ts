export type PortalKey = 'admin' | 'teacher' | 'parent' | 'student';

export interface ChildSummary {
  id: string;
  classId: string;
  name: string;
  className: string;
  section: string;
  rollNo: string;
  dob: string;
  bloodGroup: string;
  attendancePct: number;
}

export interface AuthUser {
  id: string;
  name: string;
  mobileNumber: string;
  portal: PortalKey;
  /** Supports multi-role accounts — e.g. a teacher whose child also studies at the school */
  roles: PortalKey[];
  /** Flattened module.action keys resolved for the active role */
  permissions: string[];
  /** Only present for parent accounts — the student(s) linked to this guardian */
  children?: ChildSummary[];
  /** Which linked child's data is currently in view (parent portal only) */
  activeChildId?: string;
  /** True for auto-generated DOB passwords that haven't been changed yet */
  mustResetPassword?: boolean;
  /** Caller's own Teacher.id — present only when the TEACHER role is held. */
  teacherId?: string;
  /** Caller's own Student.id/classId — present only when the STUDENT role is held. */
  studentId?: string;
  classId?: string;
}
