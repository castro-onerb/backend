import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthProfileResponseDto } from './types/auth-profile.dto';
import { seconds, SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
@Throttle({ login: { limit: 30, ttl: seconds(60) } })
export class AuthProfile {
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Perfil do usuário logado',
    description: 'Retorna os dados criados na sessão do usuário.',
  })
  @ApiOkResponse({
    description: 'Perfil do usuário autenticado retornado com sucesso.',
    type: AuthProfileResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente.' })
  @Get('/me')
  @SkipThrottle()
  getProfile(@CurrentUser() user: UserPayload | null) {
    return user;
  }
}
