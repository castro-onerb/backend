import { RecoverPasswordUseCase } from '@/domain/professional/app/use-cases/recover-password/recover-password.use-case';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { z } from 'zod';

const schemaBodyRequest = z.object({
  email: z.string().email(),
});

type requestBodyRecoveryPassword = z.infer<typeof schemaBodyRequest>;

@Controller('auth')
export class RecoveryPasswordController {
  constructor(private readonly recoveryPassword: RecoverPasswordUseCase) {}

  @Post('recovery')
  @UsePipes(new ZodValidationPipe(schemaBodyRequest))
  async recovery(@Body() body: requestBodyRecoveryPassword) {
    const { email } = body;
    const result = await this.recoveryPassword.execute({ email });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }

      throw new HttpException(
        'Erro ao recuperar senha',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Código de recuperação enviado para o email informado.',
    };
  }
}
