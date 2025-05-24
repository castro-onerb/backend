import { AppError } from '@/core/errors/app-error';

export class ResourceNotFoundError extends AppError {
  constructor() {
    super('Resource not found', { code: 'general.resource_not_found_error' });
  }
}
