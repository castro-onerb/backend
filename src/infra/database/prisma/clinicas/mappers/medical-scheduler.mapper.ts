import { UniqueID } from '@/core/object-values/unique-id';
import { IMedicalSchedulingProps } from '@/domain/professional/@types/medical-scheduling';

export interface RawMedicalSchedulingRow {
  paciente_id: string;
  start: Date;
  end: Date;
}

export class MedicalSchedulerMapper {
  static toDomain(row: RawMedicalSchedulingRow): IMedicalSchedulingProps {
    return {
      patientId: new UniqueID(row.paciente_id),
      start: row.start,
      end: row.end,
    };
  }
}
