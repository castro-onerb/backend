import { CRM } from 'src/core/object-values/crm';
import { Medical } from '../../enterprise/entities/medical.entity';

export interface IMedicalRepository {
  findByCrm(crm: CRM): Promise<Medical | null>;
}
