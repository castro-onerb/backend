import { mock } from 'vitest-mock-extended';
import { Mocked } from 'vitest';
import { Hasher } from '@/core/cryptography/hasher';
import { OperatorAuthenticateUseCase } from './authenticate-operator.use-case';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error';
import { InMemoryOperatorRepository } from 'test/memory/repositories/operator.repository';
import { UnauthorizedException } from '@nestjs/common';

describe('Authenticate Operator Use Case', () => {
  let useCase: OperatorAuthenticateUseCase;
  let operatorRepository: InMemoryOperatorRepository;
  let hasher: Mocked<Hasher>;

  beforeEach(() => {
    operatorRepository = new InMemoryOperatorRepository();
    hasher = mock<Hasher>();

    useCase = new OperatorAuthenticateUseCase(operatorRepository, hasher);
  });

  it('should not authenticate without finding a operator with the provided username.', async () => {
    const username = 'jon.doe';
    const password = '123456';

    operatorRepository.save({
      username: 'jane.doe',
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    hasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({
      username,
      password,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('shoul not be able authenticate with profile inactive', async () => {
    const username = 'jon.doe';
    const password = '123456';

    operatorRepository.save({
      username: username,
      password: 'e10adc3949ba59abbe56e057f20f883e',
      active: false,
    });

    const result = await useCase.execute({
      username: username,
      password,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UnauthorizedException);
  });

  it('should authenticate a operator with valid username and password', async () => {
    const username = 'jon.doe';
    const password = '123456';

    operatorRepository.save({
      username: username,
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    hasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({
      username,
      password,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.operator).toMatchObject({
        username: username,
      });
    }
  });

  it('should not authenticate a operator with valid username and icorrect password', async () => {
    const username = 'jon.doe';
    const password = '1234';

    operatorRepository.save({
      username: username,
      password: 'e10adc3949ba59abbe56e057f20f883e',
    });

    hasher.compare.mockResolvedValue(false);

    const result = await useCase.execute({
      username,
      password,
    });

    expect(result.isLeft()).toBe(true);
  });
});
