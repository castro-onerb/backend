import { AppError } from '@/core/errors/app-error';

export class MissingAuthenticatedUserError extends AppError {
  constructor() {
    super(
      'Não conseguimos acesso ao seu perfil, verifique seu login e tente novamente.',
      { code: 'auth.missing_user' },
    );
  }
}
