import { AppError } from '@/core/errors/app-error';

export class OperatorNotFoundError extends AppError {
  constructor() {
    super(
      'Não localizamos um operador com um usuário informado. Que tal conferir os dados?',
      { code: 'operator.not_found' },
    );
  }
}

export class MultipleOperatorsFoundError extends AppError {
  constructor() {
    super(
      'Parece que há algo errado, localizamos mais de um acesso para este mesmo usuário.',
      { code: 'operator.multiple_found' },
    );
  }
}

export class OperatorInactiveError extends AppError {
  constructor() {
    super(
      'Este perfil encontra-se desativado. Se precisar de ajuda, fale com o suporte.',
      { code: 'operator.inactive' },
    );
  }
}

export class OperatorPasswordNotSetError extends AppError {
  constructor() {
    super(
      'O acesso está indisponível porque o perfil não possui uma senha cadastrada.',
      { code: 'operator.password_not_set' },
    );
  }
}

export class OperatorEntityBuildError extends AppError {
  constructor() {
    super(
      'Falha ao preparar as informações do operador. Por favor, tente novamente mais tarde.',
      { code: 'operator.entity_build_error' },
    );
  }
}
