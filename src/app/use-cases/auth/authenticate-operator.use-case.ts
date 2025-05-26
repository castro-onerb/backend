import { Hasher } from 'src/core/cryptography/hasher';
import { Either, left, right } from '@/core/either';
import { Operator } from '@/domain/professional/entities/operator.entity';
import { UniqueID } from '@/core/object-values/unique-id';
import { DatabaseUnavailableError } from '@/core/errors/database-unavailable.error';
import { OperatorRepository } from '../../repositories/operator.repository';
import { OperatorRawResult } from '@/domain/professional/@types/raw.operator';
import { DomainEvents } from '@/core/events/domain-events';
import {
  MultipleOperatorsFoundError,
  OperatorEntityBuildError,
  OperatorInactiveError,
  OperatorNotFoundError,
  OperatorPasswordNotSetError,
} from './errors/operators.errors';
import { InvalidPasswordError } from './errors';
import { Injectable } from '@nestjs/common';

export type OperatorAuthenticateUseCaseRequest = {
  username: string;
  password: string;
};

type OperatorAuthenticateUseCaseResponse = Either<
  | MultipleOperatorsFoundError
  | OperatorEntityBuildError
  | OperatorInactiveError
  | OperatorNotFoundError
  | OperatorPasswordNotSetError
  | DatabaseUnavailableError,
  { operator: Operator }
>;

@Injectable()
export class OperatorAuthenticateUseCase {
  constructor(
    private operatorRepository: OperatorRepository,
    private readonly hasher: Hasher,
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
      return left(new OperatorNotFoundError());
    }

    if (listOperator.length > 1) {
      return left(new MultipleOperatorsFoundError());
    }

    const queryOperator = listOperator[0];

    if (!queryOperator.active) {
      return left(new OperatorInactiveError());
    }

    if (!queryOperator.password) {
      return left(new OperatorPasswordNotSetError());
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
      return left(new OperatorEntityBuildError());
    }

    const operator = operatorCreated.value;
    const isValid = await operator.compare(password, this.hasher);

    if (!isValid) {
      return left(new InvalidPasswordError());
    }

    operator.recordAccess();
    DomainEvents.dispatchEventsForAggregate(operator.id);

    return right({
      operator,
    });
  }
}
