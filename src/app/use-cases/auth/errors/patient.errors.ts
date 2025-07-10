import { AppError } from '@/core/errors/app-error';

export class PatientNotFoundError extends AppError {
  constructor() {
    super(
      'Não localizamos um paciente com o CPF informado. Que tal conferir os dados?',
      { code: 'patient.not_found' },
    );
  }
}

export class PatientPasswordNotSetError extends AppError {
  constructor() {
    super(
      'O acesso está indisponível porque o perfil não possui uma senha cadastrada.',
      { code: 'patient.password_not_set' },
    );
  }
}

export class MultiplePatientsFoundError extends AppError {
  constructor() {
    super(
      'Mais de um paciente foi encontrado com o mesmo CPF. Entre em contato com o suporte.',
      { code: 'patient.multiple_found' },
    );
  }
}

export class PatientInactiveError extends AppError {
  constructor() {
    super(
      'Este perfil encontra-se desativado. Se precisar de ajuda, fale com o suporte.',
      { code: 'patient.inactive' },
    );
  }
}
