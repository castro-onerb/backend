import { Injectable } from '@nestjs/common';
import { RecoveryPasswordRepository } from '../../repositories/recovery-password.repository';
import { Either, left, right } from '@/core/either';
import { OperatorRepository } from '../../repositories/operator.repository';
import {
  RecoverPasswordMissingIdentifierError,
  RecoverPasswordNoCodesToInvalidateError,
  RecoverPasswordOperatorSearchFailedError,
  RecoverPasswordUserConflictError,
  RecoverPasswordUserNotFoundError,
} from './errors';

export type InvalidateCodeRecoverUseCaseRequest = {
  email?: string;
  username?: string;
};

export type InvalidateCodeRecoverUseCaseResponse = Either<
  RecoverPasswordMissingIdentifierError,
  {
    success: true;
  }
>;

@Injectable()
export class InvalidateCodeRecoverUseCase {
  constructor(
    private readonly operatorRepository: OperatorRepository,
    private readonly passwordRepository: RecoveryPasswordRepository,
  ) {}

  async execute({
    email,
    username,
  }: InvalidateCodeRecoverUseCaseRequest): Promise<InvalidateCodeRecoverUseCaseResponse> {
    if (!email && !username) {
      return left(new RecoverPasswordMissingIdentifierError());
    }

    let operatorId: string | undefined = undefined;

    if (username) {
      const result = await this.resolveOperatorId(username);
      if (result.isLeft()) {
        return left(result.value);
      }
      operatorId = result.value;
    }

    const result =
      await this.passwordRepository.invalidateAllCodesByEmailOrUser({
        email,
        user: operatorId,
      });

    if (!result) {
      return left(new RecoverPasswordNoCodesToInvalidateError());
    }

    return right({ success: true });
  }

  private async resolveOperatorId(
    username: string,
  ): Promise<
    Either<
      | RecoverPasswordOperatorSearchFailedError
      | RecoverPasswordUserNotFoundError
      | RecoverPasswordUserConflictError,
      string
    >
  > {
    const operators = await this.operatorRepository.findByUsername(username);

    if (!operators) {
      return left(new RecoverPasswordOperatorSearchFailedError());
    }

    if (operators.length === 0) {
      return left(new RecoverPasswordUserNotFoundError());
    }

    if (operators.length > 1) {
      return left(new RecoverPasswordUserConflictError());
    }

    return right(operators[0].id);
  }
}
