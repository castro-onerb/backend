import { PatientRepository } from '@/app/repositories/patient.repository';
import { PatientRaw } from '@/domain/patient/@types/raw.patient';
import { faker } from '@faker-js/faker';

export class InMemoryPatientRepository implements PatientRepository {
  public patients: PatientRaw[] = [];

  async findByCpf(cpf: string): Promise<PatientRaw[] | null> {
    const result = this.patients.filter((item) => item.cpf === cpf);
    return Promise.resolve(result.length > 0 ? result : null);
  }

  save(props?: Partial<PatientRaw>) {
    const patient: PatientRaw = {
      id: faker.string.numeric({ length: { min: 4, max: 7 } }),
      fullname: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      birth: faker.date.birthdate(),
      active: true,
      password: faker.internet.password(),
      ...props,
    };

    this.patients.push(patient);
    return patient;
  }

  clear() {
    this.patients = [];
  }
}
