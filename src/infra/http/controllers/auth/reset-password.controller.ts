import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { ResetPasswordUseCase } from '@/app/use-cases/auth/reset-password.use-case';
import { Password } from '@/core/object-values/password';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { ResetPasswordDto } from './types/reset-password.dto';

const schemaBodyRequest = z.object({
  email: z.string().email(),
  code: z.string().min(6),
  password: z.string(),
});

type requestBodyResetPassword = z.infer<typeof schemaBodyRequest>;

@ApiTags('Auth')
@Controller('auth')
export class ResetPasswordController {
  constructor(private readonly resetPassword: ResetPasswordUseCase) {}

  @Post('reset-password')
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ZodValidationPipe(schemaBodyRequest))
  @ApiOperation({
    summary: 'Redefinir senha',
    description:
      'Redefine a senha de acesso de um usuário a partir do email, código de verificação e nova senha. Limitado para evitar tentativas indevidas.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Senha redefinida com sucesso.',
    schema: {
      example: {
        success: true,
        message: 'Senha redefinida com sucesso.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou código incorreto.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Código informado não confere com o email fornecido.',
        error: 'Bad Request',
      },
    },
  })
  @ApiTooManyRequestsResponse({
    description: 'Muitas tentativas em um curto período.',
    schema: {
      example: {
        statusCode: 429,
        message: 'Você fez muitas tentativas. Tente novamente em instantes.',
        error: 'Too Many Requests',
      },
    },
  })
  async reset(@Body() body: requestBodyResetPassword) {
    const { email, code, password } = body;

    const passwordObj = Password.create(password);

    if (passwordObj.isLeft()) {
      throw mapDomainErrorToHttp(passwordObj.value);
    }

    const result = await this.resetPassword.execute({
      email,
      code,
      password: passwordObj.value.getValue(),
    });

    if (result.isLeft()) {
      throw mapDomainErrorToHttp(result.value);
    }

    return {
      success: true,
      message: 'Senha redefinida com sucesso.',
    };
  }
}
