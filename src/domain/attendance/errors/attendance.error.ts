import { AppError } from '@/core/errors/app-error';

export class AttendanceInvalidStartError extends AppError {
  constructor() {
    super('No momento este atendimento não pode ser iniciado.', {
      code: 'attendance.invalid_start',
    });
  }
}

export class AttendanceInvalidFinishError extends AppError {
  constructor() {
    super('Só é possível finalizar um atendimento que está em andamento.', {
      code: 'attendance.invalid_finish',
    });
  }
}

export class AttendanceAlreadyFinishedError extends AppError {
  constructor() {
    super('Este atendimento já foi finalizado e não pode ser cancelado.', {
      code: 'attendance.already_finished',
    });
  }
}

export class AttendanceReportAlreadyAttachedError extends AppError {
  constructor() {
    super('Este atendimento já possui um relatório anexado.', {
      code: 'attendance.report_already_attached',
    });
  }
}

export class AttendanceCannotAttachReportError extends AppError {
  constructor() {
    super(
      'Só é possível anexar um relatório após a finalização do atendimento.',
      {
        code: 'attendance.cannot_attach_report',
      },
    );
  }
}

export class AttendanceSummaryNotAllowedError extends AppError {
  constructor() {
    super('O resumo só pode ser definido após a finalização do atendimento.', {
      code: 'attendance.summary_not_allowed',
    });
  }
}
