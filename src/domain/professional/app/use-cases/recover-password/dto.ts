import { Either } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error';
import { UnauthorizedException } from '@nestjs/common';

export type RecoverPasswordUseCaseRequest = {
  email: string;
};

export type OperatorAuthenticateUseCaseResponse = Either<
  UnauthorizedException | ResourceNotFoundError,
  Promise<void>
>;
