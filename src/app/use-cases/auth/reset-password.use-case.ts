import { OperatorRepository } from '@/app/repositories/operator.repository';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { MailEntity } from '@/core/entities/mail.entity';
import { RecoveryPasswordRepository } from '../../repositories/recovery-password.repository';
import { Hasher } from '@/core/cryptography/hasher';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/infra/env/env';
import {
  RecoverPasswordCodeExpiredError,
  RecoverPasswordCodeNotFoundError,
  RecoverPasswordCooldownError,
} from './errors';

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
    private readonly mail: MailEntity,
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

      await this.mail.send({
        to: email,
        subject: 'Deovita - Alerta de Segurança',
        template: 'auth/alert-recover-password',
        context: { redirect_url, email },
      });

      return left(new RecoverPasswordCodeNotFoundError());
    }

    if (record.expiresAt < new Date()) {
      return left(new RecoverPasswordCodeExpiredError());
    }

    const hashed = await this.hasher.hash(password);
    await this.operatorRepository.updatePassword({ email }, hashed);

    await this.passwordRepository.invalidateCode(record.id);

    await this.mail.send({
      to: email,
      subject: 'Deovita - Senha redefinida',
      template: 'auth/confirm-recover-password',
      context: { code },
    });

    return right({ success: true });
  }
}
