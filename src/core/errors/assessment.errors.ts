import { AppError } from './app-error';

export class AssessmentNotFoundError extends AppError {
  constructor() {
    super('Triagem não encontrada para o atendimento informado.', { code: 'ASSESSMENT_NOT_FOUND' });
  }
}

export class UnauthorizedAssessmentAccessError extends AppError {
  constructor() {
    super('Você não tem autorização para acessar esta triagem.', { code: 'UNAUTHORIZED_ASSESSMENT_ACCESS' });
  }
} 