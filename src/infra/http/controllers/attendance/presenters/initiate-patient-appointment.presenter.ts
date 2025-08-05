import dayjs from '@/core/config/dayjs.config';
import { Attendance } from '@/domain/attendance/entities/attendance.entity';

interface InitiatePatientAppointmentResponse {
  id: string;
  patient_id: string;
  medical_id: string;
  status:
    | 'free'
    | 'in_attendance'
    | 'appoimented'
    | 'finished'
    | 'cancelled'
    | 'blocked';
  modality: 'telemedicine' | 'in_person' | 'unknown';
  observations?: string;
  started_at?: string;
  finished_at?: string;
  created_at: string;
}

export class InitiatePatientAppointmentPresenter {
  static toHTTP(appointment: Attendance): InitiatePatientAppointmentResponse {
    return {
      id: appointment.id.toString(),
      status: appointment.status,
      started_at: dayjs(appointment.startedAt).isValid()
        ? dayjs(appointment.startedAt).format('YYYY-MM-DD')
        : undefined,
      created_at: dayjs(appointment.createdAt).format('YYYY-MM-DD'),
      medical_id: appointment.medicalId.toString(),
      modality: appointment.modality,
      patient_id: appointment.patientId.toString(),
      finished_at: dayjs(appointment.finishedAt).isValid()
        ? dayjs(appointment.finishedAt).format('YYYY-MM-DD')
        : undefined,
      observations: appointment.observations,
    };
  }
}
