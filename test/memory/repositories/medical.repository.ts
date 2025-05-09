import { CRM } from 'src/core/object-values/crm';
import { IMedicalRepository } from 'src/domain/professional/app/repositories/medical.repository';
import { Medical } from 'src/domain/professional/enterprise/entities/medical.entity';

export class InMemoryMedicalRepository implements IMedicalRepository {
  medicals: Medical[] = [];

  async findByCrm(crm: CRM) {
    const medical = this.medicals.find((doctor) => doctor.crm.equals(crm));
    return Promise.resolve(medical ?? null);
  }
}
