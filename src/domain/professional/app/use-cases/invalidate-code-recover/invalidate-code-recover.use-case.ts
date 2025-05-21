import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRecoveryPasswordRepository } from '../../repositories/recovery-password.repository';
import {
  InvalidateCodeRecoverUseCaseRequest,
  InvalidateCodeRecoverUseCaseResponse,
} from './dto';
import { Either, left, right } from '@/core/either';
import { IOperatorRepository } from '../../repositories/operator.repository';

@Injectable()
export class InvalidateCodeRecoverUseCase {
  constructor(
    @Inject('IOperatorRepository')
    private readonly operatorRepository: IOperatorRepository,

    @Inject('IRecoveryPasswordRepository')
    private readonly passwordRepository: IRecoveryPasswordRepository,
  ) {}

  async execute({
    email,
    username,
  }: InvalidateCodeRecoverUseCaseRequest): Promise<InvalidateCodeRecoverUseCaseResponse> {
    if (!email && !username) {
      return left(
        new BadRequestException(
          'Não foi possível prosseguir com a solicitação, precisamos de um email ou usuário para continuar.',
        ),
      );
    }

    let operatorId: string | undefined = undefined;

    if (username) {
      const result = await this.resolveOperatorId(username);
      if (result.isLeft())
        return left(new NotFoundException(result.value.message));
      operatorId = result.value;
    }

    const result =
      await this.passwordRepository.invalidateAllCodesByEmailOrUser({
        email,
        user: operatorId,
      });

    if (!result) {
      return left(
        new InternalServerErrorException(
          `Não existe nenhum código para desativar para o email ${email}.`,
        ),
      );
    }

    return right({ success: true });
  }

  private async resolveOperatorId(
    username: string,
  ): Promise<Either<HttpException, string>> {
    const operators = await this.operatorRepository.findByUsername(username);

    if (!operators) {
      return left(new InternalServerErrorException('Erro ao buscar operador.'));
    }

    if (operators.length === 0) {
      return left(new NotFoundException('Usuário não encontrado.'));
    }

    if (operators.length > 1) {
      return left(
        new ConflictException('Mais de um operador com este usuário.'),
      );
    }

    return right(operators[0].id);
  }
}
