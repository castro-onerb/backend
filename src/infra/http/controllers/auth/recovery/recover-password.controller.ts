import { RecoverPasswordUseCase } from '@/app/use-cases/auth/recover-password.use-case';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../../../pipes/zod-validation.pipe';
import { z } from 'zod';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { seconds, Throttle } from '@nestjs/throttler';

const schemaBodyRequest = z.object({
  email: z.string().email(),
});

type requestBodyRecoveryPassword = z.infer<typeof schemaBodyRequest>;

@ApiTags('Auth')
@Controller('auth')
export class RecoveryPasswordController {
  constructor(private readonly recoveryPassword: RecoverPasswordUseCase) {}

  @Throttle({ recovery: { limit: 3, ttl: seconds(60) } })
  @Post('recover-password')
  @UsePipes(new ZodValidationPipe(schemaBodyRequest))
  @ApiBody({ schema: { example: { email: 'usuario@dominio.com' } } })
  @ApiOperation({
    summary: 'Solicitar código de recuperação de senha',
    description:
      'Gera e envia um código de recuperação para o e-mail fornecido.',
  })
  @ApiResponse({
    status: 200,
    description: 'Código de recuperação enviado com sucesso.',
    schema: {
      example: {
        success: true,
        message: 'Código de recuperação enviado para o email informado.',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'E-mail não encontrado.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Não encontramos acesso a esse email.',
        error: 'Not Found',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Mais de um usuário com o mesmo e-mail.',
    schema: {
      example: {
        statusCode: 409,
        message: 'Encontramos mais de um operador com esse email vinculado.',
        error: 'Conflict',
      },
    },
  })
  async recovery(@Body() body: requestBodyRecoveryPassword) {
    const { email } = body;
    const result = await this.recoveryPassword.execute({ email });

    if (result.isLeft()) {
      throw mapDomainErrorToHttp(result.value);
    }

    return {
      success: true,
      message: 'Código de recuperação enviado para o email informado.',
    };
  }
}
