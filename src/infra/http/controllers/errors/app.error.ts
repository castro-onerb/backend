import { AppError } from '@/core/errors/app-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

export class InvalidDateError extends AppError {
  constructor() {
    super('A data fornecida não é válida.', { code: 'app.invalid_date' });
  }
}

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(429).json({
      statusCode: 429,
      message:
        'Você fez muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.',
      error: 'Too Many Requests',
    });
  }
}
