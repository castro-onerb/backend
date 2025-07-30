import dayjs from '@/core/config/dayjs.config';
import { IPatientExamProps } from '@/domain/patient/@types/patient-exam';
import { PatientExamRaw } from '@/domain/patient/@types/raw.patient-exam';

export class PatientExamsMapper {
  static toDomain(row: PatientExamRaw): IPatientExamProps {
    return {
      ticket: String(row.id),
      patientId: String(row.patient_id),
      examId: String(row.exam_id),
      professionalName: row.professional_name,
      procedure: row.procedure,
      observations: row.observations ?? undefined,
      performedDate: dayjs(row.performed_date).toDate(),
      scheduledDate: dayjs(row.scheduled_date).toDate(),
      group: row.group,
      paid: Boolean(row.paid),
      status: row.status,
      estimatedDate: dayjs(row.estimated_date).toDate(),
      updatedAt: dayjs(row.updated_at).toDate(),
      createdAt: dayjs(row.created_at).toDate(),
    };
  }
}
