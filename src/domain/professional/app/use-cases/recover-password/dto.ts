import { Either } from '@/core/either';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export type RecoverPasswordUseCaseRequest = {
  email: string;
};

export type OperatorAuthenticateUseCaseResponse = Either<
  UnauthorizedException | NotFoundException,
  Promise<void>
>;
