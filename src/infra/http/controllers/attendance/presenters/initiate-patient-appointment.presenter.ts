import { AttendanceNotFoundError } from '@/app/use-cases/patient-attendance/errors';
import { InitiatePatientAppointmentUseCaseResponse } from '@/app/use-cases/patient-attendance/initiate-patient-appointment.use-case';
import dayjs from '@/core/config/dayjs.config';
import { Either, left, right } from '@/core/either';
import { AttendanceStatusType } from '@/domain/attendance/@types/attendance-status';
import { AttendanceInvalidStartError } from '@/domain/errors';

interface InitiatePatientAppointmentHttp {
  id: string;
  patient_id: string;
  medical_id: string;
  status: AttendanceStatusType;
  modality: 'telemedicine' | 'in_person' | 'unknown';
  observations?: string;
  started_at?: string;
  finished_at?: string;
  created_at: string;
}

export type InitiatePatientAppointmentPresenterResponse = Either<
  AttendanceNotFoundError | AttendanceInvalidStartError,
  { attendance: InitiatePatientAppointmentHttp }
>;

export class InitiatePatientAppointmentPresenter {
  static toHTTP(
    result: InitiatePatientAppointmentUseCaseResponse,
  ): InitiatePatientAppointmentPresenterResponse {
    if (result.isLeft()) {
      return left(result.value);
    }

    const { attendance } = result.value;

    const http: InitiatePatientAppointmentHttp = {
      id: attendance.id.toString(),
      status: attendance.status,
      started_at: dayjs(attendance.startedAt).isValid()
        ? dayjs(attendance.startedAt).format('YYYY-MM-DD')
        : undefined,
      created_at: dayjs(attendance.createdAt).format('YYYY-MM-DD'),
      medical_id: attendance.medicalId.toString(),
      modality: attendance.modality,
      patient_id: attendance.patientId.toString(),
      finished_at: dayjs(attendance.finishedAt).isValid()
        ? dayjs(attendance.finishedAt).format('YYYY-MM-DD')
        : undefined,
      observations: attendance.observations,
    };

    return right({ attendance: http });
  }
}
