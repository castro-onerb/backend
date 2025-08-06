export const AttendanceStatus = {
  in_attendance: 'in_attendance',
  finished: 'finished',
  cancelled: 'cancelled',
  free: 'free',
  appointment: 'appointment',
  blocked: 'blocked',
  missed: 'missed',
} as const;

export type AttendanceStatusType =
  (typeof AttendanceStatus)[keyof typeof AttendanceStatus];
