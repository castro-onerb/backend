import { CheckRequirementsUseCase } from '@/app/use-cases/auth/check-requirements.use-case';
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
import { seconds, SkipThrottle, Throttle } from '@nestjs/throttler';
import { AuthRequirementsResponseDto } from './types/auth-requirements.dto';
import { RequirementPresenter } from './presenters/requirement.presenter';

@ApiTags('Auth')
@Controller('auth')
@Throttle({ login: { limit: 30, ttl: seconds(60) } })
export class AuthRequirementsController {
  constructor(private readonly checkRequirements: CheckRequirementsUseCase) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Requisitos do perfil do usuário',
    description: 'Retorna a lista de requisitos pendentes para o usuário.',
  })
  @ApiOkResponse({
    description: 'Requisitos retornados com sucesso.',
    type: AuthRequirementsResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente.' })
  @Get('/requirements')
  @SkipThrottle()
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.checkRequirements.execute({
      userId: user.sub,
    });

    return {
      requirements: result.requirements.map(RequirementPresenter.toHTTP),
    };
  }
}
