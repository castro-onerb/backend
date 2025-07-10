import { IPatientProps } from '@/domain/patient/@types/patient';
import { PatientRawResult } from '@/domain/patient/@types/raw.patient';

export class PatientMapper {
  static toDomain(row: PatientRawResult): IPatientProps {
    return {
      name: row.fullname,
      cpf: row.cpf,
      birth: row.birth,
      active: row.active,
    };
  }
}
