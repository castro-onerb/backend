import { AttendanceEntityProps } from '@/domain/attendance/@types/attendance';

export abstract class AttendanceRepository {
  abstract findByAttendanceId(
    attendance: string,
  ): Promise<AttendanceEntityProps | null>;
}
