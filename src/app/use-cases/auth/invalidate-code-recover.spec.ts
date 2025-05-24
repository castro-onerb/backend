import { InMemoryRecoveryPasswordRepository } from 'test/memory/repositories/prontuario/recovery-password.repository';
import { InvalidateCodeRecoverUseCase } from './invalidate-code-recover.use-case';
import { InMemoryOperatorRepository } from 'test/memory/repositories/clinicas/operator.repository';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('InvalidateCodeRecoverUseCase', () => {
  let useCase: InvalidateCodeRecoverUseCase;
  let operatorRepository: InMemoryOperatorRepository;
  let passwordRepository: InMemoryRecoveryPasswordRepository;

  beforeEach(() => {
    operatorRepository = new InMemoryOperatorRepository();
    passwordRepository = new InMemoryRecoveryPasswordRepository();

    useCase = new InvalidateCodeRecoverUseCase(
      operatorRepository,
      passwordRepository,
    );
  });

  it('should return BadRequestException if no email and no username provided', async () => {
    const result = await useCase.execute({
      email: undefined,
      username: undefined,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    if (result.isLeft()) {
      expect(result.value.message).toMatch(
        /precisamos de um email ou usuário/i,
      );
    }
  });

  it('should return NotFoundException if username not found', async () => {
    operatorRepository.operators.push({
      id: 'user-01',
      fullname: 'Jon Doe',
      cpf: '12345678910',
      username: 'jon.doe',
      email: 'jondoe@example.com',
      password: '123456',
      type: 4,
      active: true,
    });

    const result = await useCase.execute({
      email: undefined,
      username: 'jane.doe',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
    if (result.isLeft()) {
      expect(result.value.message).toMatch(/Usuário não encontrado/i);
    }
  });

  it('should return ConflictException if multiple users with the same username are found', async () => {
    operatorRepository.operators.push({
      id: 'user-01',
      fullname: 'Jon Doe',
      cpf: '12345678910',
      username: 'jon.doe',
      email: 'jondoe@example.com',
      password: '123456',
      type: 4,
      active: true,
    });

    operatorRepository.operators.push({
      id: 'user-02',
      fullname: 'Jon Doe Silva',
      cpf: '12345678910',
      username: 'jon.doe',
      email: 'jondoe@example.com',
      password: '123456',
      type: 4,
      active: true,
    });

    const result = await useCase.execute({
      email: undefined,
      username: 'jon.doe',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ConflictException);
    if (result.isLeft()) {
      expect(result.value.message).toMatch(
        /Mais de um operador com este usuário/i,
      );
    }
  });

  it('should return InternalServerErrorException if operator is null', async () => {
    operatorRepository.operators.push({
      id: 'user-01',
      fullname: 'Jon Doe',
      cpf: '12345678910',
      username: 'jon.doe',
      email: 'jondoe@example.com',
      password: '123456',
      type: 4,
      active: true,
    });

    const result = await useCase.execute({
      email: undefined,
      username: 'jon.doe',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InternalServerErrorException);
    if (result.isLeft()) {
      expect(result.value.message).toMatch(
        /Não existe nenhum código para desativar/i,
      );
    }
  });

  it('should be able invalidate code recovery password', async () => {
    operatorRepository.operators.push({
      id: 'user-01',
      fullname: 'Jon Doe',
      cpf: '12345678910',
      username: 'jon.doe',
      email: 'jondoe@example.com',
      password: '123456',
      type: 4,
      active: true,
    });

    await passwordRepository.save({
      code: 'K5MG8H',
      userId: 'user-01',
      email: 'jondoe@example.com',
      expiresAt: new Date(),
    });

    const result = await useCase.execute({
      email: undefined,
      username: 'jon.doe',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(expect.objectContaining({ success: true }));
  });
});
