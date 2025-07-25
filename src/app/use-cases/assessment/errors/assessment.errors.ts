import { AppError } from '@/core/errors/app-error';

export class AssessmentNotFoundError extends AppError {
  constructor() {
    super('Triagem não encontrada para o atendimento informado.', {
      code: 'assessment.not_found',
    });
  }
}

export class UnauthorizedAssessmentAccessError extends AppError {
  constructor() {
    super('Você não tem autorização para acessar esta triagem.', {
      code: 'assessment.unauthorized',
    });
  }
}
