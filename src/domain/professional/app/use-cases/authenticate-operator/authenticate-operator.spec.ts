import { mock } from 'vitest-mock-extended';
import { Mocked, vi } from 'vitest';
import { Hasher } from '@/core/cryptography/hasher';
import { OperatorAuthenticateUseCase } from './authenticate-operator.use-case';
import { InMemoryOperatorRepository } from 'test/memory/repositories/clinicas/operator.repository';
import {
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Operator } from '@/domain/professional/enterprise/entities/operator.entity';
import { left } from '@/core/either';

describe('Authenticate Operator Use Case', () => {
  let useCase: OperatorAuthenticateUseCase;
  let operatorRepository: InMemoryOperatorRepository;
  let hasher: Mocked<Hasher>;

  beforeEach(() => {
    operatorRepository = new InMemoryOperatorRepository();
    hasher = mock<Hasher>();

    useCase = new OperatorAuthenticateUseCase(operatorRepository, hasher);
  });

  it('should not authenticate if no operator found with the provided username', async () => {
    const username = 'jon.doe';
    const password = '123456';

    operatorRepository.save({
      username: 'jane.doe',
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    hasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({ username, password });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should not authenticate if multiple operators share the same username', async () => {
    const username = 'jon.doe';
    const password = '123456';

    operatorRepository.save({
      username,
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    operatorRepository.save({
      username,
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    hasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({ username, password });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
    expect((result.value as NotFoundException).message).toMatch(
      /mais de um acesso/,
    );
  });

  it('should not authenticate if operator profile is inactive', async () => {
    const username = 'jon.doe';
    const password = '123456';

    operatorRepository.save({
      username,
      password: 'e10adc3949ba59abbe56e057f20f883e',
      active: false,
    });

    const result = await useCase.execute({ username, password });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UnauthorizedException);
    expect((result.value as UnauthorizedException).message).toMatch(
      /desativado/,
    );
  });

  it('should not authenticate if operator has no password set', async () => {
    const username = 'jon.doe';
    const password = '123456';

    operatorRepository.save({
      username,
      password: undefined,
    });

    const result = await useCase.execute({ username, password });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
    expect((result.value as NotFoundException).message).toMatch(
      /não possui uma senha/,
    );
  });

  it('should return internal error if creating the Operator entity fails', async () => {
    const username = 'jon.doe';
    const password = '123456';

    operatorRepository.save({
      id: String(1),
      username,
      fullname: 'Operator Test',
      cpf: '12345678900',
      email: 'operator.test@example.com',
      password: 'hashedpassword',
      active: true,
    });

    const createSpy = vi
      .spyOn(Operator, 'create')
      .mockReturnValueOnce(
        left(new InternalServerErrorException('Falha na criação da entidade')),
      );

    const result = await useCase.execute({ username, password });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
    expect((result.value as Error).message).toMatch(
      /Falha ao preparar as informações do operador/,
    );

    createSpy.mockRestore();
  });

  it('should authenticate an operator with valid username and password', async () => {
    const username = 'jon.doe';
    const password = '123456';

    operatorRepository.save({
      username,
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    hasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({ username, password });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.operator).toMatchObject({ username });
    }
  });

  it('should not authenticate an operator with valid username and incorrect password', async () => {
    const username = 'jon.doe';
    const password = '1234';

    operatorRepository.save({
      username,
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    hasher.compare.mockResolvedValue(false);

    const result = await useCase.execute({ username, password });

    expect(result.isLeft()).toBe(true);
  });
});
