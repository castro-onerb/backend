import { AppError } from '@/core/errors/app-error';

export class InvalidPasswordError extends AppError {
  constructor() {
    super('Não conseguimos validar sua senha. Confira e tente novamente.', {
      code: 'auth.invalid_password',
    });
  }
}
