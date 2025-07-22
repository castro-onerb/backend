import { PatientRaw } from '@/domain/patient/@types/raw.patient';

export abstract class PatientRepository {
  abstract findByCpf(cpf: string): Promise<PatientRaw[] | null>;
}
