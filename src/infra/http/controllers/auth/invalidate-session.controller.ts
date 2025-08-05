import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ActiveSessionRepository } from '@/app/repositories/active-session.repository';
import { SessionRedisService } from './redis/session-redis.service';

@ApiTags('Auth')
@Controller('auth')
export class InvalidateSessionController {
  constructor(
    private readonly activeSessionRepository: ActiveSessionRepository,
    private readonly sessionRedisService: SessionRedisService, // ⬅ injetado
  ) {}

  @Get('sessions/:id/invalidate')
  @ApiOperation({ summary: 'Invalida uma sessão ativa' })
  @ApiParam({ name: 'id', description: 'ID da sessão ativa' })
  @ApiOkResponse({
    description: 'Sessão invalidada com sucesso.',
    schema: {
      example: { message: 'Sessão invalidada com sucesso.' },
    },
  })
  async invalidate(@Param('id') id: string) {
    await this.activeSessionRepository.invalidate(id);
    await this.sessionRedisService.invalidateSession(id);

    return { message: 'Sessão invalidada com sucesso.' };
  }
}
