import {
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseUnavailableError } from './database-unavailable.error';

function hasMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function mapDomainErrorToHttp(error: unknown) {
  if (error instanceof NotFoundException) {
    throw new NotFoundException(hasMessage(error) ? error.message : undefined);
  }

  if (error instanceof DatabaseUnavailableError) {
    throw new ServiceUnavailableException(
      hasMessage(error) ? error.message : undefined,
    );
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
