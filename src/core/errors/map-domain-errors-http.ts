import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResourceNotFoundError } from './resource-not-found.error';

function hasMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function mapDomainErrorToHttp(error: unknown) {
  if (error instanceof ResourceNotFoundError) {
    throw new NotFoundException(hasMessage(error) ? error.message : undefined);
  }

  if (error instanceof UnauthorizedException) {
    throw new UnauthorizedException(
      hasMessage(error) ? error.message : undefined,
    );
  }

  if (error instanceof BadRequestException) {
    throw new BadRequestException(
      hasMessage(error) ? error.message : undefined,
    );
  }

  throw new BadRequestException(
    hasMessage(error) ? error.message : 'Erro de negócio.',
  );
}
