import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryRecoveryPasswordRepository } from 'test/memory/repositories/prontuario/recovery-password.repository';
import { InMemoryOperatorRepository } from 'test/memory/repositories/clinicas/operator.repository';
import { RecoverPasswordUseCase } from './recover-password.use-case';
import {
  RecoverPasswordEmailNotFoundError,
  RecoverPasswordMultipleUsersError,
} from './errors';
import { DomainEvents } from '@/core/events/domain-events';
import { PasswordRecoveryRequested } from '@/domain/professional/events/password-recovery-requested.event';

describe('RecoverPasswordUseCase', () => {
  let useCase: RecoverPasswordUseCase;
  let operatorRepository: InMemoryOperatorRepository;
  let recoveryRepository: InMemoryRecoveryPasswordRepository;

  const fakeEmail = 'john.doe@example.com';

  beforeEach(() => {
    operatorRepository = new InMemoryOperatorRepository();
    recoveryRepository = new InMemoryRecoveryPasswordRepository();

    useCase = new RecoverPasswordUseCase(
      operatorRepository,
      recoveryRepository,
    );
  });

  it('should send a recovery code if email is valid and unique', async () => {
    operatorRepository.save({
      id: 'user-01',
      fullname: 'John Doe',
      cpf: '12345678900',
      email: fakeEmail,
    });

    const result = await useCase.execute({
      email: fakeEmail,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toEqual({ success: true });
    }

    const saved = recoveryRepository.recoveryRequests[0];
    expect(saved).toBeDefined();
    expect(saved.email).toBe(fakeEmail);
    expect(saved.userId).toBe('user-01');
    expect(saved.code).toHaveLength(6);
    expect(saved.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('should dispatch PasswordRecoveryRequested event when recovery is successful', async () => {
    const dispatchSpy = vi.spyOn(DomainEvents, 'dispatch');

    operatorRepository.save({
      id: 'user-01',
      fullname: 'John Doe',
      cpf: '12345678900',
      email: fakeEmail,
    });

    const result = await useCase.execute({
      email: fakeEmail,
    });

    expect(result.isRight()).toBe(true);
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.any(PasswordRecoveryRequested),
    );

    const dispatchedEvent = dispatchSpy.mock.calls.find(
      ([event]) => event instanceof PasswordRecoveryRequested,
    )?.[0];

    expect(dispatchedEvent).toBeDefined();
    if (dispatchedEvent instanceof PasswordRecoveryRequested) {
      expect(dispatchedEvent.email).toBe(fakeEmail);
      expect(typeof dispatchedEvent.code).toBe('string');
      expect(dispatchedEvent.code.length).toBeGreaterThan(0);
      expect(dispatchedEvent.name).toBe('John Doe');
    }
  });

  it('should not be able to request a code if cant find an email', async () => {
    operatorRepository.save({
      id: 'user-01',
      fullname: 'Jane Doe Silva',
      cpf: '12345678910',
      email: 'janedoe@example.com',
    });

    const result = await useCase.execute({
      email: fakeEmail,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RecoverPasswordEmailNotFoundError);
  });

  it('should not be possible to request a code if there are multiple users with the same email', async () => {
    operatorRepository.save({
      id: 'user-01',
      fullname: 'Jane Doe Silva',
      cpf: '12345678910',
      email: fakeEmail,
    });

    operatorRepository.save({
      id: 'user-02',
      fullname: 'Jane Doe',
      cpf: '01987654321',
      email: fakeEmail,
    });

    const result = await useCase.execute({
      email: fakeEmail,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RecoverPasswordMultipleUsersError);
  });
});
