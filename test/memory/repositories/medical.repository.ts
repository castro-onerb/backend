import { MedicalRawResult } from '@/domain/professional/enterprise/@types/raw.medical';
import { faker } from '@faker-js/faker';
import { CRM } from 'src/core/object-values/crm';
import { IMedicalRepository } from 'src/domain/professional/app/repositories/medical.repository';

export class InMemoryMedicalRepository implements IMedicalRepository {
  medicals: MedicalRawResult[] = [];

  async findByCrm(crm: CRM) {
    const medical = this.medicals.find((doctor) => doctor.crm === crm.value);
    return Promise.resolve(medical ?? null);
  }

  save(props?: Partial<MedicalRawResult>) {
    const medical = {
      id: faker.string.numeric({ length: { min: 4, max: 7 } }),
      fullname: faker.person.fullName(),
      crm: faker.string.alphanumeric(6) + '-CE',
      type: 4,
      cpf: faker.string.numeric(11),
      email: faker.internet.email(),
      username: faker.internet.username(),
      password: faker.internet.password(),
      active: true,
      ...props,
    };

    this.medicals.push(medical);
    return medical;
  }
}
