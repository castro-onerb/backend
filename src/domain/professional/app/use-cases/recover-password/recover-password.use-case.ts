import { IOperatorRepository } from '@/domain/professional/app/repositories/operator.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RecoverPasswordUseCaseRequest } from './dto';
import { left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error';
import { IRecoveryPasswordRepository } from '@/infra/database/prisma/repositories/@types/interface-recovery-password';
import { MailEntity } from '@/core/entities/mail.entity';

@Injectable()
export class RecoverPasswordUseCase {
  constructor(
    @Inject('IOperatorRepository')
    private readonly operatorRepository: IOperatorRepository,

    @Inject('IRecoveryPasswordRepository')
    private readonly recoverypasswordrepository: IRecoveryPasswordRepository,

    private readonly mail: MailEntity,
  ) {}

  async execute({ email }: RecoverPasswordUseCaseRequest) {
    const operator = await this.operatorRepository.findByEmail(email);

    if (!operator || operator.length === 0) {
      return left(new ResourceNotFoundError());
    }

    if (operator.length > 1) {
      return left(
        new UnauthorizedException(
          'Encontramos mais de um operador com esse email vinculado.',
        ),
      );
    }

    const user = operator[0];

    const code = this.generateCode();

    await this.recoverypasswordrepository.save({
      userId: user.id,
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await this.mail.send({
      to: email,
      subject: 'Recuperação de senha',
      template: 'recouver-password',
      context: { name: user.fullname, code },
    });

    return right({ success: true });
  }

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
