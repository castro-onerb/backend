import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InvalidateCodeRecoverUseCase } from '@/app/use-cases/auth/invalidate-code-recover.use-case';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { InvalidateCodeRecoveryDto } from './types/invalidate-recovery.dto';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';

@ApiTags('Auth')
@Controller('auth')
export class InvalidateCodeRecoverController {
  constructor(
    private readonly invalidateCodeRecover: InvalidateCodeRecoverUseCase,
  ) {}

  @Post('invalidate-codes')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: InvalidateCodeRecoveryDto })
  @ApiOperation({
    summary: 'Invalidar códigos de recuperação',
    description:
      'Invalida todos os códigos de recuperação de senha não utilizados vinculados ao e-mail fornecido.',
  })
  @ApiResponse({
    status: 200,
    description: 'Os códigos ativos foram invalidados corretamente.',
    schema: {
      example: {
        message:
          'Uffa, tudo certo por aqui, todos os códigos foram desativados.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Erro interno ao tentar invalidar os códigos.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Não existe nenhum código para desativar para este usuário.',
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Erro de autenticação.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Você não tem permissão para acessar esse recurso.',
        error: 'Unauthorized',
      },
    },
  })
  async recovery(@Body() { email }: InvalidateCodeRecoveryDto) {
    const result = await this.invalidateCodeRecover.execute({ email });

    if (result.isLeft()) {
      throw mapDomainErrorToHttp(result.value);
    }

    return {
      message: 'Uffa, tudo certo por aqui, todos os códigos foram desativados.',
    };
  }
}
