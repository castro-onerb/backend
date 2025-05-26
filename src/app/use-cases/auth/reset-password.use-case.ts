import { OperatorRepository } from '@/app/repositories/operator.repository';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { RecoveryPasswordRepository } from '../../repositories/recovery-password.repository';
import { Hasher } from '@/core/cryptography/hasher';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/infra/env/env';
import {
  RecoverPasswordCodeExpiredError,
  RecoverPasswordCodeNotFoundError,
  RecoverPasswordCooldownError,
} from './errors';
import { DomainEvents } from '@/core/events/domain-events';
import { PasswordRecoveryAttemptFailed } from '@/domain/professional/events/password-recovery-attempt-failed.event';
import { PasswordSuccessfullyReset } from '@/domain/professional/events/password-successfully-reset.event';

export type ResetPasswordUseCaseRequest = {
  email: string;
  code: string;
  password: string;
};

export type ResetPasswordUseCaseResponse = Either<
  | RecoverPasswordCooldownError
  | RecoverPasswordCodeNotFoundError
  | RecoverPasswordCodeExpiredError,
  { success: true }
>;

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly operatorRepository: OperatorRepository,
    private readonly passwordRepository: RecoveryPasswordRepository,
    private readonly hasher: Hasher,
    private config: ConfigService<Env, true>,
  ) {}

  async execute({
    email,
    code,
    password,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const lastUsed = await this.passwordRepository.findLastUsedCode(email);

    if (lastUsed) {
      const now = new Date();
      const diffInMs = now.getTime() - new Date(lastUsed.expiresAt).getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);

      if (diffInHours < 12) {
        return left(new RecoverPasswordCooldownError());
      }
    }

    const record = await this.passwordRepository.findByEmailAndCode(
      email,
      code,
    );

    if (!record) {
      const redirect_url = this.config.get('FRONTEND_URL', { infer: true });

      DomainEvents.dispatch(
        new PasswordRecoveryAttemptFailed({
          email,
          redirectUrl: redirect_url,
        }),
      );

      return left(new RecoverPasswordCodeNotFoundError());
    }

    if (record.expiresAt < new Date()) {
      return left(new RecoverPasswordCodeExpiredError());
    }

    const hashed = await this.hasher.hash(password);
    await this.operatorRepository.updatePassword({ email }, hashed);

    await this.passwordRepository.invalidateCode(record.id);

    DomainEvents.dispatch(
      new PasswordSuccessfullyReset({
        email,
      }),
    );

    return right({ success: true });
  }
}
