import { IPatientProps } from '@/domain/patient/@types/patient';
import { PatientRaw } from '@/domain/patient/@types/raw.patient';

export class PatientMapper {
  static toDomain(row: PatientRaw): IPatientProps {
    return {
      name: row.fullname,
      cpf: row.cpf,
      birth: row.birth,
      active: row.active,
    };
  }
}
