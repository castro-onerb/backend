import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { z } from 'zod';
import { InvalidateCodeRecoverUseCase } from '@/app/use-cases/invalidate-code-recover/invalidate-code-recover.use-case';

const schemaQueryEmail = z.string().email();

type requestQueryInvalidateCodes = z.infer<typeof schemaQueryEmail>;

@Controller('auth')
export class InvalidateCodeRecoverController {
  constructor(
    private readonly invalidateCodeRecover: InvalidateCodeRecoverUseCase,
  ) {}

  @Get('invalidate-codes')
  @UsePipes(new ZodValidationPipe(schemaQueryEmail))
  async recovery(@Query('email') email: requestQueryInvalidateCodes) {
    const result = await this.invalidateCodeRecover.execute({ email });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }

      throw new HttpException(
        'Tivemos um erro interno ao invalidar todos os códigos.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Uffa, tudo certo por aqui, todos os códigos foram desativados.',
    };
  }
}
