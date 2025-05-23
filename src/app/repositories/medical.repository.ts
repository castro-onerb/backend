import { CRM } from 'src/core/object-values/crm';
import { MedicalRawResult } from '../../enterprise/@types/raw.medical';

export interface IMedicalRepository {
  findByCrm(crm: CRM): Promise<MedicalRawResult[] | null>;
}
