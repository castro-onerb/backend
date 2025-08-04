import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { FetchSchedulingsByMedicalIdUseCase } from '@/app/use-cases/medical-scheduler/fetch-schedulings-by-medical-id.use-case';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { MissingAuthenticatedUserError } from '../errors';

@ApiTags('Schedulers')
@Controller('medical')
export class FetchSchedulingsController {
  constructor(
    private readonly fetchSchedulingsUseCase: FetchSchedulingsByMedicalIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/schedulings')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar agendamentos do médico',
    description:
      'Retorna todos os agendamentos vinculados ao médico autenticado através do token JWT.',
  })
  @ApiOkResponse({
    description: 'Lista de agendamentos retornada com sucesso.',
    schema: {
      example: [
        {
          id: 'ag123',
          patientName: 'João da Silva',
          procedure: 'Consulta Clínica',
          scheduledDate: '2025-07-22T14:00:00Z',
          status: 'scheduled',
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token JWT inválido.',
        error: 'Unauthorized',
      },
    },
  })
  async fetchSchedulings(@CurrentUser() user: UserPayload | null) {
    if (!user?.sub) {
      throw mapDomainErrorToHttp(new MissingAuthenticatedUserError());
    }

    const schedulings = await this.fetchSchedulingsUseCase.execute({
      id: user.sub,
    });

    return schedulings;
  }
}
