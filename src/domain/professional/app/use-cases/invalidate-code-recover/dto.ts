import { Either } from '@/core/either';
import {
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export type InvalidateCodeRecoverUseCaseRequest = {
  email?: string;
  username?: string;
};

export type InvalidateCodeRecoverUseCaseResponse = Either<
  UnauthorizedException | NotFoundException | HttpException,
  {
    success: true;
  }
>;
