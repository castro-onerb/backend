import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthProfile {
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Perfil do usuário autenticado retornado com sucesso.',
    schema: {
      example: {
        sub: '123456',
        name: 'usuario123',
        role: 'medical | operator | patient',
        iat: 1753185565,
        exp: 1753186465,
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente.' })
  @Get('profile')
  getProfile(@CurrentUser() user: UserPayload | null) {
    return user;
  }
}
