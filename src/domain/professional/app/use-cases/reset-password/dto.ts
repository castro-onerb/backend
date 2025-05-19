import { Either } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error';
import { UnauthorizedException } from '@nestjs/common';

export type ResetPasswordUseCaseRequest = {
  email: string;
  code: string;
  password: string;
};

export type ResetPasswordUseCaseResponse = Either<
  UnauthorizedException | ResourceNotFoundError,
  Promise<void>
>;
