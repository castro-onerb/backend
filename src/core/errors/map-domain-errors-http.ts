import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AppError } from './app-error';

export function mapDomainErrorToHttp(error: AppError) {
  switch (error.code) {
    case 'operator.not_found':
    case 'patient.not_found':
    case 'medical.not_found':
    case 'attendance.not_found':
    case 'recovery_password.email_not_found':
    case 'recovery_password.user_not_found':
    case 'recovery_password.code_not_found':
    case 'recovery_password.no_codes_to_invalidate':
      return new NotFoundException(error.message);

    case 'medical.multiple_found':
    case 'recovery_password.multiple_users':
    case 'recovery_password.user_conflict':
      return new ConflictException(error.message);

    case 'medical.inactive':
    case 'medical.password_not_set':
    case 'recovery_password.cooldown_redefinition':
    case 'recovery_password.code_expired':
      return new ForbiddenException(error.message);

    case 'recovery_password.unauthorized':
      return new UnauthorizedException(error.message);

    case 'medical.invalid_crm_format':
    case 'recovery_password.missing_identifier':
    case 'recovery_password.operator_search_failed':
      return new BadRequestException(error.message);

    case 'medical.entity_build_error':
      return new InternalServerErrorException(error.message);

    default:
      return new BadRequestException(error.message);
  }
}
