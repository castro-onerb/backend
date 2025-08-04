import { AppError } from '@/core/errors/app-error';

export class MissingAuthenticatedUserError extends AppError {
  constructor() {
    super(
      'Não conseguimos acesso ao seu perfil, verifique seu login e tente novamente.',
      { code: 'auth.missing_user' },
    );
  }
}

export class UnauthorizedPermissionError extends AppError {
  constructor() {
    super(
      'Ops, parece que não conseguimos validar sua permissão para esta ação.',
      { code: 'auth.unauthorized_permission' },
    );
  }
}
