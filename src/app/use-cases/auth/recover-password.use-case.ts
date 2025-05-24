import { OperatorRepository } from '@/app/repositories/operator.repository';
import { Either, left, right } from '@/core/either';
import { MailEntity } from '@/core/entities/mail.entity';
import { formatName } from '@/core/utils/format-name';
import { RecoveryPasswordRepository } from '../../repositories/recovery-password.repository';
import {
  RecoverPasswordEmailNotFoundError,
  RecoverPasswordMultipleUsersError,
} from './errors';
import { Injectable } from '@nestjs/common';

export type RecoverPasswordUseCaseRequest = {
  email: string;
};

export type OperatorAuthenticateUseCaseResponse = Either<
  RecoverPasswordEmailNotFoundError | RecoverPasswordMultipleUsersError,
  { success: true }
>;

@Injectable()
export class RecoverPasswordUseCase {
  constructor(
    private readonly operatorRepository: OperatorRepository,
    private readonly recoveryPasswordRepository: RecoveryPasswordRepository,
    private readonly mail: MailEntity,
  ) {}

  async execute({
    email,
  }: RecoverPasswordUseCaseRequest): Promise<OperatorAuthenticateUseCaseResponse> {
    const operator = await this.operatorRepository.findByEmail(email);

    if (!operator || operator.length === 0) {
      return left(new RecoverPasswordEmailNotFoundError());
    }

    const user = operator[0];

    const code = this.generateCode();

    await this.recoveryPasswordRepository.save({
      userId: user.id,
      email,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutos
    });

    const { name } = formatName(user.fullname);

    await this.mail.send({
      to: email,
      subject: 'Deovita - Recuperação de senha',
      template: 'auth/recover-password',
      context: { name, code },
    });

    return right({ success: true });
  }

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
