import { mock } from 'vitest-mock-extended';
import { Mocked, vi } from 'vitest';
import { Hasher } from '@/core/cryptography/hasher';
import { OperatorAuthenticateUseCase } from './authenticate-operator.use-case';
import { InMemoryOperatorRepository } from 'test/memory/repositories/clinicas/operator.repository';
import { Operator } from '@/domain/professional/entities/operator.entity';
import { left } from '@/core/either';
import {
  MultipleOperatorsFoundError,
  OperatorEntityBuildError,
  OperatorInactiveError,
  OperatorNotFoundError,
  OperatorPasswordNotSetError,
} from './errors/operators.errors';
import { InvalidPasswordError } from './errors';
import { DomainEvents } from '@/core/events/domain-events';
import { NewAccessAccount } from '@/domain/professional/events/new-access-account.event';

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
    expect(result.value).toBeInstanceOf(OperatorNotFoundError);
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
    expect(result.value).toBeInstanceOf(MultipleOperatorsFoundError);
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
    expect(result.value).toBeInstanceOf(OperatorInactiveError);
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
    expect(result.value).toBeInstanceOf(OperatorPasswordNotSetError);
  });

  it('should return error if creating the Operator entity fails', async () => {
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
      .mockReturnValueOnce(left(new OperatorEntityBuildError()));

    const result = await useCase.execute({ username, password });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OperatorEntityBuildError);

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

  it('should dispatch OperatorAccessed event when login is successful', async () => {
    const username = 'jon.doe';
    const password = '123456';

    operatorRepository.save({
      id: 'op-01',
      username,
      fullname: 'Jon Doe',
      cpf: '12345678900',
      email: 'jon@example.com',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      active: true,
    });

    hasher.compare.mockResolvedValue(true);

    const dispatchSpy = vi.spyOn(DomainEvents, 'dispatch');

    const result = await useCase.execute({ username, password });

    expect(result.isRight()).toBe(true);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(NewAccessAccount));

    const event = dispatchSpy.mock.calls.find(
      ([e]) => e instanceof NewAccessAccount,
    )?.[0];

    expect(event).toBeDefined();
    expect(event).toBeInstanceOf(NewAccessAccount);
    expect(event?.aggregateId.toString()).toBe('op-01');
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
    expect(result.value).toBeInstanceOf(InvalidPasswordError);
  });
});
