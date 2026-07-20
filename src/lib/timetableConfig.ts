import type { DayOfWeek } from './timetableApi';

export interface PeriodSlot {
  /** Real teaching periods start at 1 (matches the backend's periodNumber). 0 = break, never persisted. */
  periodNumber: number;
  label: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
}

/** Placeholder bell schedule — same 6 slots the pre-existing mock used. Not
 *  school-configurable yet; easy to make so later if a school needs a different one. */
export const PERIOD_SLOTS: PeriodSlot[] = [
  { periodNumber: 1, label: '9:00', startTime: '09:00', endTime: '09:45' },
  { periodNumber: 2, label: '9:45', startTime: '09:45', endTime: '10:30' },
  { periodNumber: 3, label: '10:30', startTime: '10:30', endTime: '11:15' },
  { periodNumber: 0, label: 'Break', startTime: '11:15', endTime: '11:45', isBreak: true },
  { periodNumber: 4, label: '11:45', startTime: '11:45', endTime: '12:30' },
  { periodNumber: 5, label: '12:30', startTime: '12:30', endTime: '13:15' },
];

export const TIMETABLE_DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'MONDAY', label: 'Mon' },
  { key: 'TUESDAY', label: 'Tue' },
  { key: 'WEDNESDAY', label: 'Wed' },
  { key: 'THURSDAY', label: 'Thu' },
  { key: 'FRIDAY', label: 'Fri' },
  { key: 'SATURDAY', label: 'Sat' },
];
