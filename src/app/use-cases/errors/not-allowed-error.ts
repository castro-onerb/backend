import { AppError } from '@/core/errors/app-error';

export class NotAllowedError extends AppError {
  constructor() {
    super('Não permitido', { code: 'general.not_allowed_error' });
  }
}
