import { AppError } from './app-error';

export class PasswordTooShortError extends AppError {
  constructor() {
    super('Sua senha precisa ter pelo menos 6 caracteres.', {
      code: 'password.too_short',
    });
  }
}

export class PasswordMissingUppercaseError extends AppError {
  constructor() {
    super('Sua senha deve conter ao menos uma letra maiúscula.', {
      code: 'password.missing_uppercase',
    });
  }
}

export class PasswordMissingSymbolError extends AppError {
  constructor() {
    super('Sua senha deve conter ao menos um símbolo.', {
      code: 'password.missing_symbol',
    });
  }
}

export class PasswordSequentialNumberError extends AppError {
  constructor() {
    super('Sua senha não deve conter números sequenciais.', {
      code: 'password.sequential_numbers',
    });
  }
}

export class PasswordGenerationLengthError extends AppError {
  constructor() {
    super('A senha gerada precisa ter no mínimo 6 caracteres.', {
      code: 'password.generation_too_short',
    });
  }
}
