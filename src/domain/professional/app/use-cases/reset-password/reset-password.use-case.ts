import { IOperatorRepository } from '@/domain/professional/app/repositories/operator.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ResetPasswordUseCaseRequest } from './dto';
import { left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error';
import { MailEntity } from '@/core/entities/mail.entity';
import { IRecoveryPasswordRepository } from '../../repositories/recovery-password.repository';
import { Hasher } from '@/core/cryptography/hasher';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/infra/env/env';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('IOperatorRepository')
    private readonly operatorRepository: IOperatorRepository,

    @Inject('IRecoveryPasswordRepository')
    private readonly passwordRepository: IRecoveryPasswordRepository,

    @Inject('Hasher')
    private readonly hasher: Hasher,

    private config: ConfigService<Env, true>,

    private readonly mail: MailEntity,
  ) {}

  async execute({ email, code, password }: ResetPasswordUseCaseRequest) {
    const lastUsed = await this.passwordRepository.findLastUsedCode(email);

    if (lastUsed) {
      const now = new Date();
      const diffInMs = now.getTime() - new Date(lastUsed.expiresAt).getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);

      if (diffInHours < 12) {
        return left(
          new UnauthorizedException(
            'Por segurança, só é possível redefinir a senha a cada 12 horas desde a última vez.',
          ),
        );
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

      return left(
        new ResourceNotFoundError(
          'Não conseguimos identificar o código fornecido.',
        ),
      );
    }

    if (record.expiresAt < new Date()) {
      return left(
        new UnauthorizedException('Este código já expirou, solicite outro'),
      );
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
