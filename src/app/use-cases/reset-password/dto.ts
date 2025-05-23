import { Either } from '@/core/either';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export type ResetPasswordUseCaseRequest = {
  email: string;
  code: string;
  password: string;
};

export type ResetPasswordUseCaseResponse = Either<
  UnauthorizedException | NotFoundException,
  Promise<void>
>;
