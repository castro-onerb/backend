import { Injectable } from '@nestjs/common';
import { AttendanceRedisService } from '../redis/attendance-redis.service';

interface StartAttendancePayload {
  medicalId: number;
  attendanceId: number;
}

@Injectable()
export class AttendanceFlowService {
  constructor(private readonly redisService: AttendanceRedisService) {}

  async startAttendance({ medicalId, attendanceId }: StartAttendancePayload) {
    const currentAttendances =
      await this.redisService.getAttendances(medicalId);

    const currentInProgress = currentAttendances.find(
      (a) => a.status === 'in_attendance',
    );

    if (currentInProgress && currentInProgress.id !== attendanceId) {
      await this.redisService.updateAttendanceStatus(
        medicalId,
        currentInProgress.id,
        'paused',
      );
    }

    const alreadyExists = currentAttendances.some((a) => a.id === attendanceId);
    if (!alreadyExists) {
      await this.redisService.addAttendance(medicalId, {
        id: attendanceId,
        status: 'in_attendance',
        startedAt: new Date().toISOString(),
      });
    } else {
      await this.redisService.updateAttendanceStatus(
        medicalId,
        attendanceId,
        'in_attendance',
      );
    }
  }
}
