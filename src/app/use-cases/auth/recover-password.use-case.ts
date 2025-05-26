import { OperatorRepository } from '@/app/repositories/operator.repository';
import { Either, left, right } from '@/core/either';
import { RecoveryPasswordRepository } from '../../repositories/recovery-password.repository';
import {
  RecoverPasswordEmailNotFoundError,
  RecoverPasswordMultipleUsersError,
} from './errors';
import { Injectable } from '@nestjs/common';
import { DomainEvents } from '@/core/events/domain-events';
import { UniqueID } from '@/core/object-values/unique-id';
import { PasswordRecoveryRequested } from '@/domain/professional/events/password-recovery-requested.event';
import { formatName } from '@/core/utils/format-name';

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
  ) {}

  async execute({
    email,
  }: RecoverPasswordUseCaseRequest): Promise<OperatorAuthenticateUseCaseResponse> {
    const operator = await this.operatorRepository.findByEmail(email);

    if (!operator || operator.length === 0) {
      return left(new RecoverPasswordEmailNotFoundError());
    }

    if (operator.length > 1) {
      return left(new RecoverPasswordMultipleUsersError());
    }

    const user = operator[0];

    const code = this.generateCode();

    await this.recoveryPasswordRepository.save({
      userId: user.id,
      email,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutos
    });

    const { name } = formatName(user.fullname);

    DomainEvents.dispatch(
      new PasswordRecoveryRequested({
        aggregateId: new UniqueID(user.id),
        email,
        name,
        code,
      }),
    );

    return right({ success: true });
  }

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
