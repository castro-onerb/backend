export const AttendanceStatus = {
  in_attendance: 'in_attendance',
  finished: 'finished',
  cancelled: 'cancelled',
  free: 'free',
  blocked: 'blocked',
  missed: 'missed',
} as const;

export type AttendanceStatusType =
  (typeof AttendanceStatus)[keyof typeof AttendanceStatus];
