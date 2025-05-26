import { InMemoryRecoveryPasswordRepository } from 'test/memory/repositories/prontuario/recovery-password.repository';
import { InvalidateCodeRecoverUseCase } from './invalidate-code-recover.use-case';
import { InMemoryOperatorRepository } from 'test/memory/repositories/clinicas/operator.repository';
import {
  RecoverPasswordMissingIdentifierError,
  RecoverPasswordNoCodesToInvalidateError,
  RecoverPasswordUserConflictError,
  RecoverPasswordUserNotFoundError,
} from './errors';

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

  it('should return error when neither email nor username are provided', async () => {
    const result = await useCase.execute({
      email: undefined,
      username: undefined,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RecoverPasswordMissingIdentifierError);
  });

  it('should return error when username does not match any user', async () => {
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
    expect(result.value).toBeInstanceOf(RecoverPasswordUserNotFoundError);
  });

  it('should return error when multiple users are found with the same username', async () => {
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
    expect(result.value).toBeInstanceOf(RecoverPasswordUserConflictError);
  });

  it('should return error when no recovery code exists for the user', async () => {
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
    expect(result.value).toBeInstanceOf(
      RecoverPasswordNoCodesToInvalidateError,
    );
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
