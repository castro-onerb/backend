import { RedisService } from '@/infra/redis/redis.service';
import { Injectable } from '@nestjs/common';

interface ActiveAttendance {
  id: number;
  status: 'in_attendance' | 'paused';
  startedAt: string;
}

@Injectable()
export class AttendanceRedisService {
  constructor(private readonly redis: RedisService) {}

  private getKey(medicalId: number) {
    return `attendances:active:med-${medicalId}`;
  }

  async addAttendance(medicalId: number, attendance: ActiveAttendance) {
    const key = this.getKey(medicalId);
    const attendancesRaw = await this.redis.get(key);
    const attendances = attendancesRaw
      ? (JSON.parse(attendancesRaw) as ActiveAttendance[])
      : [];

    // Remove se já existir para evitar duplicatas
    const filtered = attendances.filter((a) => a.id !== attendance.id);
    filtered.push(attendance);

    await this.redis.set(key, JSON.stringify(filtered));
  }

  async getAttendances(medicalId: number): Promise<ActiveAttendance[]> {
    const raw = await this.redis.get(this.getKey(medicalId));
    return raw ? (JSON.parse(raw) as ActiveAttendance[]) : [];
  }

  async updateAttendanceStatus(
    medicalId: number,
    attendanceId: number,
    status: ActiveAttendance['status'],
  ) {
    const key = this.getKey(medicalId);
    const attendances = await this.getAttendances(medicalId);
    const updated = attendances.map((a) =>
      a.id === attendanceId ? { ...a, status } : a,
    );
    await this.redis.set(key, JSON.stringify(updated));
  }

  async removeAttendance(medicalId: number, attendanceId: number) {
    const attendances = await this.getAttendances(medicalId);
    const filtered = attendances.filter((a) => a.id !== attendanceId);
    await this.redis.set(this.getKey(medicalId), JSON.stringify(filtered));
  }

  async clearAttendances(medicalId: number) {
    await this.redis.del(this.getKey(medicalId));
  }
}
