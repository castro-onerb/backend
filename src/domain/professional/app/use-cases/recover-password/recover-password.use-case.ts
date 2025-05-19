import { IOperatorRepository } from '@/domain/professional/app/repositories/operator.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RecoverPasswordUseCaseRequest } from './dto';
import { left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error';
import { MailEntity } from '@/core/entities/mail.entity';
import { formatName } from '@/core/utils/format-name';
import { IRecoveryPasswordRepository } from '../../repositories/interface-recovery-password';

@Injectable()
export class RecoverPasswordUseCase {
  constructor(
    @Inject('IOperatorRepository')
    private readonly operatorRepository: IOperatorRepository,

    @Inject('IRecoveryPasswordRepository')
    private readonly recoveryPasswordRepository: IRecoveryPasswordRepository,

    private readonly mail: MailEntity,
  ) {}

  async execute({ email }: RecoverPasswordUseCaseRequest) {
    const operator = await this.operatorRepository.findByEmail(email);

    if (!operator || operator.length === 0) {
      return left(
        new ResourceNotFoundError('Não encontramos acesso a esse email.'),
      );
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
      template: 'recover-password',
      context: { name, code },
    });

    return right({ success: true });
  }

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
