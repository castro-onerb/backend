import { IOperatorRepository } from '@/app/repositories/operator.repository';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RecoverPasswordUseCaseRequest } from './dto';
import { Either, left, right } from '@/core/either';
import { MailEntity } from '@/core/entities/mail.entity';
import { formatName } from '@/core/utils/format-name';
import { IRecoveryPasswordRepository } from '../../repositories/recovery-password.repository';

@Injectable()
export class RecoverPasswordUseCase {
  constructor(
    @Inject('IOperatorRepository')
    private readonly operatorRepository: IOperatorRepository,

    @Inject('IRecoveryPasswordRepository')
    private readonly recoveryPasswordRepository: IRecoveryPasswordRepository,

    private readonly mail: MailEntity,
  ) {}

  async execute({
    email,
  }: RecoverPasswordUseCaseRequest): Promise<
    Either<NotFoundException | UnauthorizedException, { success: true }>
  > {
    const operator = await this.operatorRepository.findByEmail(email);

    if (!operator || operator.length === 0) {
      return left(
        new NotFoundException('Não encontramos acesso a esse email.'),
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
      template: 'auth/recover-password',
      context: { name, code },
    });

    return right({ success: true });
  }

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
