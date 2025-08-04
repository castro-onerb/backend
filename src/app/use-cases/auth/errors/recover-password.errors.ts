import { AppError } from '@/core/errors/app-error';

export class RecoverPasswordMissingIdentifierError extends AppError {
  constructor() {
    super(
      'Não foi possível prosseguir com a solicitação, precisamos de um email ou usuário para continuar.',
      { code: 'recovery_password.missing_identifier' },
    );
  }
}

export class RecoverPasswordOperatorSearchFailedError extends AppError {
  constructor() {
    super('Erro ao buscar operador. Por favor, tente novamente mais tarde.', {
      code: 'recovery_password.operator_search_failed',
    });
  }
}

export class RecoverPasswordUserNotFoundError extends AppError {
  constructor() {
    super('Usuário não encontrado. Que tal revisar os dados informados?', {
      code: 'recovery_password.user_not_found',
    });
  }
}

export class RecoverPasswordUserConflictError extends AppError {
  constructor() {
    super(
      'Mais de um operador com este usuário foi encontrado. Por favor, entre em contato com o suporte.',
      { code: 'recovery_password.user_conflict' },
    );
  }
}

export class RecoverPasswordNoCodesToInvalidateError extends AppError {
  constructor() {
    super('Não existe nenhum código para desativar para este usuário.', {
      code: 'recovery_password.no_codes_to_invalidate',
    });
  }
}

export class RecoverPasswordEmailNotFoundError extends AppError {
  constructor() {
    super('Não encontramos acesso a esse email.', {
      code: 'recovery_password.email_not_found',
    });
  }
}

export class RecoverPasswordMultipleUsersError extends AppError {
  constructor() {
    super('Encontramos mais de um operador com esse email vinculado.', {
      code: 'recovery_password.multiple_users',
    });
  }
}

export class RecoverPasswordCooldownError extends AppError {
  constructor() {
    super(
      'Por segurança, só é possível redefinir a senha a cada 12 horas desde a última vez.',
      { code: 'recovery_password.cooldown_redefinition' },
    );
  }
}

export class RecoverPasswordCodeNotFoundError extends AppError {
  constructor() {
    super('Não conseguimos identificar o código fornecido.', {
      code: 'recovery_password.code_not_found',
    });
  }
}

export class RecoverPasswordCodeExpiredError extends AppError {
  constructor() {
    super('Este código já expirou, solicite outro.', {
      code: 'recovery_password.code_expired',
    });
  }
}

export class RecoverPasswordUnauthorizedError extends AppError {
  constructor() {
    super('Não conseguimos autorização para realizar esta ação.', {
      code: 'recovery_password.unauthorized',
    });
  }
}
