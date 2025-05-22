import { mock } from 'vitest-mock-extended';
import { Mocked } from 'vitest';
import { Hasher } from '@/core/cryptography/hasher';
import { MedicalAuthenticateUseCase } from './authenticate-medical.use-case';
import { CRM } from '@/core/object-values/crm';
import { InMemoryMedicalRepository } from 'test/memory/repositories/clinicas/medical.repository';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Medical } from '@/domain/professional/enterprise/entities/medical.entity';
import { left } from '@/core/either';

describe('Authenticate Medical Use Case', () => {
  let useCase: MedicalAuthenticateUseCase;
  let medicalRepository: InMemoryMedicalRepository;
  let hasher: Mocked<Hasher>;

  beforeEach(() => {
    medicalRepository = new InMemoryMedicalRepository();
    hasher = mock<Hasher>();

    useCase = new MedicalAuthenticateUseCase(medicalRepository, hasher);
  });

  it('It should not authenticate without finding a doctor with the provided CRM.', async () => {
    const crm = CRM.create('123456-CE');
    const password = '123456';

    if (crm.isLeft()) {
      throw new Error('CRM inválido');
    }

    medicalRepository.save({
      crm: '654321-CE',
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    hasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({
      crm: crm.value,
      password,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should not authenticate if doctor has no password set', async () => {
    const crm = CRM.create('123456-CE');
    const password = '123456';

    if (crm.isLeft()) {
      throw new Error('CRM inválido');
    }

    medicalRepository.save({
      crm: crm.value.value,
      password: undefined,
    });

    const result = await useCase.execute({
      crm: crm.value,
      password,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
    expect((result.value as NotFoundException).message).toMatch(
      /não possui uma senha/,
    );
  });

  it('should return internal error if creating the Medical entity fails', async () => {
    const crm = CRM.create('123456-CE');
    const password = '123456';

    if (crm.isLeft()) {
      throw new Error('CRM inválido');
    }

    medicalRepository.save({
      id: String(1),
      crm: crm.value.value,
      fullname: 'Dr. Test',
      cpf: '12345678900',
      email: 'dr.test@example.com',
      username: 'drtest',
      password: 'hashedpassword',
      active: true,
    });

    const createSpy = vi
      .spyOn(Medical, 'create')
      .mockReturnValueOnce(
        left(new BadRequestException('Falha na criação da entidade')),
      );

    const result = await useCase.execute({
      crm: crm.value,
      password,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
    expect((result.value as Error).message).toMatch(
      /Falha ao preparar as informações do médico/,
    );

    createSpy.mockRestore();
  });

  it('shoul not be able authenticate with profile inactive', async () => {
    const crm = CRM.create('123456-CE');
    const password = '123456';

    if (crm.isLeft()) {
      throw new Error('CRM inválido');
    }

    medicalRepository.save({
      crm: crm.value.value,
      password: 'e10adc3949ba59abbe56e057f20f883e',
      active: false,
    });

    const result = await useCase.execute({
      crm: crm.value,
      password,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UnauthorizedException);
  });

  it('should not authenticate if multiple doctors share the same CRM', async () => {
    const crm = CRM.create('123456-CE');
    const password = '123456';

    if (crm.isLeft()) {
      throw new Error('CRM inválido');
    }

    medicalRepository.save({
      crm: crm.value.value,
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    medicalRepository.save({
      crm: crm.value.value,
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    hasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({
      crm: crm.value,
      password,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ConflictException);
  });

  it('should authenticate a medical with valid CRM and password', async () => {
    const crm = CRM.create('123456-CE');
    const password = '123456';

    if (crm.isLeft()) {
      throw new Error('CRM inválido');
    }

    medicalRepository.save({
      crm: crm.value.value,
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    hasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({
      crm: crm.value,
      password,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.medical).toMatchObject({
        crm: crm.value.value,
      });
    }
  });

  it('should not authenticate a medical with valid CRM and icorrect password', async () => {
    const crm = CRM.create('123456-CE');
    const password = '1234';

    if (crm.isLeft()) {
      throw new Error('CRM inválido');
    }

    medicalRepository.save({
      crm: crm.value.value,
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    hasher.compare.mockResolvedValue(false);

    const result = await useCase.execute({
      crm: crm.value,
      password,
    });

    expect(result.isLeft()).toBe(true);
  });
});
