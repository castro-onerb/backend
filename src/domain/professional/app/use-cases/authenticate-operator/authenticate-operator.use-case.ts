import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OperatorAuthenticateUseCaseRequest } from './dto';
import { Hasher } from 'src/core/cryptography/hasher';
import { Either, left, right } from '@/core/either';
import { Operator } from '@/domain/professional/enterprise/entities/operator.entity';
import { UniqueID } from '@/core/object-values/unique-id';
import { DatabaseUnavailableError } from '@/core/errors/database-unavailable.error';
import { IOperatorRepository } from '../../repositories/operator.repository';
import { OperatorRawResult } from '@/domain/professional/enterprise/@types/raw.operator';

type OperatorAuthenticateUseCaseResponse = Either<
  UnauthorizedException | NotFoundException | DatabaseUnavailableError,
  { operator: ReturnType<Operator['toObject']> }
>;

@Injectable()
export class OperatorAuthenticateUseCase {
  constructor(
    @Inject('IOperatorRepository')
    private operatorRepository: IOperatorRepository,
    @Inject('Hasher') private readonly hasher: Hasher,
  ) {}

  async execute({
    username,
    password,
  }: OperatorAuthenticateUseCaseRequest): Promise<OperatorAuthenticateUseCaseResponse> {
    let listOperator: OperatorRawResult[] | null;

    try {
      listOperator = await this.operatorRepository.findByUsername(username);
    } catch {
      return left(new DatabaseUnavailableError());
    }

    if (!listOperator || listOperator.length === 0) {
      return left(
        new NotFoundException(
          'Não localizamos um operador com um usuário informado. Que tal conferir os dados?',
        ),
      );
    }

    if (listOperator.length > 1) {
      return left(
        new NotFoundException(
          'Parece que há algo errado, localizamos mais de um acesso para este mesmo usuário.',
        ),
      );
    }

    const queryOperator = listOperator[0];

    if (!queryOperator.active) {
      return left(
        new UnauthorizedException(
          'Este perfil encontra-se desativado. Se precisar de ajuda, fale com o suporte.',
        ),
      );
    }

    if (!queryOperator.password) {
      return left(
        new NotFoundException(
          'O acesso está indisponível porque o perfil não possui uma senha cadastrada.',
        ),
      );
    }

    const operatorCreated = Operator.create(
      {
        name: queryOperator.fullname,
        cpf: queryOperator.cpf,
        email: queryOperator.email,
        username: queryOperator.username,
        password: queryOperator.password,
      },
      new UniqueID(`${queryOperator.id}`),
    );

    if (operatorCreated.isLeft()) {
      return left(
        new InternalServerErrorException(
          'Falha ao preparar as informações do operador. Por favor, tente novamente mais tarde.',
        ),
      );
    }

    const operator = operatorCreated.value;
    const isValid = await operator.compare(password, this.hasher);

    if (!isValid) {
      return left(
        new UnauthorizedException(
          'Não conseguimos validar sua senha. Confira e tente novamente.',
        ),
      );
    }

    return right({
      operator: operator.toObject(),
    });
  }
}
