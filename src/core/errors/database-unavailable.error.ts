import { AppError } from './app-error';

export class DatabaseUnavailableError extends AppError {
  constructor() {
    super('Banco de dados indisponível no momento.', {
      code: 'database.unavailable',
    });
  }
}
