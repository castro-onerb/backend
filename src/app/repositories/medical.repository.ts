import { MedicalRawResult } from '@/domain/professional/@types/raw.medical';
import { CRM } from 'src/core/object-values/crm';

export abstract class MedicalRepository {
  abstract findByCrm(crm: CRM): Promise<MedicalRawResult[] | null>;
}
