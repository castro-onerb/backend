import { AppError } from '@/core/errors/app-error';

export class MedicalEntityBuildError extends AppError {
  constructor() {
    super(
      'Falha ao preparar as informações do médico. Por favor, tente novamente mais tarde.',
      { code: 'medical.entity_build_error' },
    );
  }
}

export class MedicalInactiveError extends AppError {
  constructor() {
    super(
      'Este perfil encontra-se desativado. Se precisar de ajuda, fale com o suporte.',
      { code: 'medical.inactive' },
    );
  }
}

export class MedicalInvalidCrmFormatError extends AppError {
  constructor() {
    super('O CRM registrado parece estar em um formato inválido.', {
      code: 'medical.invalid_crm_format',
    });
  }
}

export class MedicalNotFoundError extends AppError {
  constructor() {
    super(
      'Não localizamos um médico com o CRM informado. Que tal conferir os dados?',
      { code: 'medical.not_found' },
    );
  }
}

export class MedicalPasswordNotSetError extends AppError {
  constructor() {
    super(
      'O acesso está indisponível porque o perfil não possui uma senha cadastrada.',
      { code: 'medical.password_not_set' },
    );
  }
}

export class MultipleDoctorsFoundError extends AppError {
  constructor() {
    super(
      'Mais de um médico foi encontrado com o mesmo CRM. Entre em contato com o suporte.',
      { code: 'medical.multiple_found' },
    );
  }
}
