import { Medical } from '../../enterprise/entities/medical.entity';

export interface IMedicalRepository {
  findByCrm(crm: string): Promise<Medical | null>;
}
