export type PortalKey = 'admin' | 'teacher' | 'parent' | 'student';

export interface ChildSummary {
  id: string;
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
}
