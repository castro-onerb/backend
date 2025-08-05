import dayjs from '@/core/config/dayjs.config';
import { UniqueID } from '@/core/object-values/unique-id';
import { AttendanceRaw } from '@/domain/attendance/@types/raw.attendance';
import { Attendance } from '@/domain/attendance/entities/attendance.entity';

export class AttendanceMapper {
  static toDomain(row: AttendanceRaw): Attendance {
    return Attendance.create(
      {
        patientId: new UniqueID(row.patient_id),
        medicalId: new UniqueID(row.medical_id),
        status: row.status,
        modality: row.modality,
        observations: row.observations,
        createdAt: dayjs(row.created_at).toDate(),
        finishedAt: dayjs(row.finished_at).isValid()
          ? dayjs(row.finished_at).toDate()
          : undefined,
        startedAt: dayjs(row.started_at).isValid()
          ? dayjs(row.started_at).toDate()
          : undefined,
        updatedAt: dayjs(row.updated_at).isValid()
          ? dayjs(row.updated_at).toDate()
          : undefined,
      },
      new UniqueID(row.id),
    );
  }
}
