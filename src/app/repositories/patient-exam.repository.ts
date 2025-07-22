import { IPatientExamProps } from '@/domain/patient/@types/patient-exam';

export abstract class PatientExamRepository {
  abstract findByPatientId(
    patientId: string,
    page: number,
    perPage: number,
  ): Promise<IPatientExamProps[]>;
}
