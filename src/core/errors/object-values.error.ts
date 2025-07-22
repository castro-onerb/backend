import { AppError } from './app-error';

export class CpfNotValid extends AppError {
  constructor() {
    super('O CPF fornecido não é válido, verifique o número digitado.', {
      code: 'object_values.not_valid',
    });
  }
}

export class CRMNotValid extends AppError {
  constructor() {
    super(
      'Hmm... não conseguimos reconhecer esse CRM. Verifique se está no formato certo.',
      { code: 'object_values.not_valid' },
    );
  }
}
