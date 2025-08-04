import { mock } from 'vitest-mock-extended';
import { Mocked } from 'vitest';
import { Encrypter } from '@/core/cryptography/encrypter';
import { PatientAuthenticateUseCase } from './authenticate-patient.use-case';
import {
  InvalidPasswordError,
  MultiplePatientsFoundError,
  PatientInactiveError,
  PatientNotFoundError,
} from './errors';
import { DatabaseUnavailableError } from '@/core/errors/database-unavailable.error';
import { InMemoryPatientRepository } from 'test/memory/repositories/clinicas/patient.repository';
import { PatientRepository } from '@/app/repositories/patient.repository';

describe('Authenticate Patient Use Case', () => {
  let useCase: PatientAuthenticateUseCase;
  let patientRepository: InMemoryPatientRepository;
  let encrypter: Mocked<Encrypter>;

  beforeEach(() => {
    patientRepository = new InMemoryPatientRepository();
    encrypter = mock<Encrypter>();
    useCase = new PatientAuthenticateUseCase(patientRepository, encrypter);
  });

  it('should not authenticate if no patient found with provided CPF', async () => {
    const cpf = '12345678900';
    const password = '123456';

    encrypter.decrypt.mockReturnValue(password);

    const result = await useCase.execute({ cpf, password });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PatientNotFoundError);
  });

  it('should not authenticate if multiple patients share same CPF', async () => {
    const cpf = '12345678900';
    const password = '123456';

    patientRepository.save({ cpf, password: 'enc1' });
    patientRepository.save({ cpf, password: 'enc2' });

    encrypter.decrypt.mockReturnValue(password);

    const result = await useCase.execute({ cpf, password });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(MultiplePatientsFoundError);
  });

  it('should not authenticate if patient profile is inactive', async () => {
    const cpf = '12345678900';
    const password = '123456';

    patientRepository.save({ cpf, active: false, password: 'enc' });
    encrypter.decrypt.mockReturnValue(password);

    const result = await useCase.execute({ cpf, password });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PatientInactiveError);
  });

  it('should not authenticate with incorrect password', async () => {
    const cpf = '12345678900';
    const password = '123456';

    patientRepository.save({ cpf, password: 'enc' });
    encrypter.decrypt.mockReturnValue('wrong');

    const result = await useCase.execute({ cpf, password });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPasswordError);
  });

  it('should authenticate patient with valid CPF and password', async () => {
    const cpf = '12345678900';
    const password = '123456';

    patientRepository.save({
      id: 'pat-01',
      cpf,
      password: 'enc',
      fullname: 'John Doe',
    });
    encrypter.decrypt.mockReturnValue(password);

    const result = await useCase.execute({ cpf, password });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.patient).toBeDefined();
    }
  });

  it('should return database unavailable error when repository fails', async () => {
    const cpf = '12345678900';
    const password = '123456';

    const failingRepo: PatientRepository = {
      findByCpf: () => {
        throw new Error('db down');
      },
    };

    useCase = new PatientAuthenticateUseCase(failingRepo, encrypter);

    const result = await useCase.execute({ cpf, password });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DatabaseUnavailableError);
  });
});
