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
import { AuthProfileResponseDto } from './types/auth-profile.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthProfile {
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Perfil do usuário autenticado retornado com sucesso.',
    type: AuthProfileResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente.' })
  @Get('profile')
  getProfile(@CurrentUser() user: UserPayload | null) {
    return user;
  }
}
