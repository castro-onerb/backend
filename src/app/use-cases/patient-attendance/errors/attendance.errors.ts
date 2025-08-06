import { AppError } from '@/core/errors/app-error';

export class AttendanceNotFoundError extends AppError {
  constructor() {
    super('Atendimento não encontrado.', {
      code: 'attendance.not_found',
    });
  }
}
