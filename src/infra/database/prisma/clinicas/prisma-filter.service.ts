import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientInitializationError)
export class PrismaInitExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientInitializationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      status: 'error',
      message:
        'Serviço de banco de dados indisponível. Tente novamente mais tarde.',
    });
  }
}
