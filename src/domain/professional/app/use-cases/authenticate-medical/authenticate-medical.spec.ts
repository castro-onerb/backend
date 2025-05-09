import { InMemoryMedicalRepository } from 'test/memory/repositories/medical.repository';
import { beforeEach, describe, it } from 'vitest';
import { MedicalAuthenticateUseCase } from './authenticate-medical.use-case';
import { makeMedical } from 'test/factories/make-medical';
import { CRM } from 'src/core/object-values/crm';
import { Md5Hasher } from 'src/infra/cryptography/md5-hasher';

let medicalRepository: InMemoryMedicalRepository;
let hasher: Md5Hasher;
let medicalAuthenticateUseCase: MedicalAuthenticateUseCase;

describe('Authenticate Medical UseCase', () => {
  beforeEach(() => {
    medicalRepository = new InMemoryMedicalRepository();
    hasher = new Md5Hasher();
    medicalAuthenticateUseCase = new MedicalAuthenticateUseCase(
      medicalRepository,
      hasher,
    );
    const { medical } = makeMedical();
    medicalRepository.medicals.push(medical);
  });

  it('It should be able the doctor authenticate himself', async () => {
    const crm = new CRM('123456/UF');
    const password = '123456';

    const medicalAuth = await medicalAuthenticateUseCase.execute({
      crm,
      password,
    });

    console.log(medicalAuth);
  });
});
