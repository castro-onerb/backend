import { PatientRawResult } from '@/domain/patient/@types/raw.patient';

export abstract class PatientRepository {
  abstract findByCpf(cpf: string): Promise<PatientRawResult[] | null>;
}
