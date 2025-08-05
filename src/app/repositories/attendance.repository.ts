import { Attendance } from '@/domain/attendance/entities/attendance.entity';

export abstract class AttendanceRepository {
  abstract findByAttendanceId(attendance: string): Promise<Attendance | null>;
}
