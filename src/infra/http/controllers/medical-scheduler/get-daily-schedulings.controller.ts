import { GetDailySchedulingsByMedicalIdUseCase } from '@/app/use-cases/medical-scheduler/get-daily-schedulings-by-medical.use-case';
import dayjsConfig from '@/core/config/dayjs.config';
import dayjs from '@/core/config/dayjs.config';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MissingAuthenticatedUserError } from '../errors';
import { InvalidDateError } from '../errors/app.error';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MedicalSchedulingListResponseDto } from './types/medical-scheduling.response.dto';

@ApiTags('Schedulers')
@Controller('medical')
export class GetDailySchedulingsController {
  constructor(
    private readonly getDailySchedulingsUseCase: GetDailySchedulingsByMedicalIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('schedulings/daily')
  @UseGuards(JwtAuthGuard)
  @Get('schedulings/daily')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar agendamentos do dia',
    description:
      'Retorna os agendamentos do dia atual ou da data fornecida (formato YYYY-MM-DD) para o médico autenticado.',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Data no formato YYYY-MM-DD',
    example: '2025-07-22',
  })
  @ApiOkResponse({
    description: 'Lista de agendamentos retornada com sucesso.',
    type: MedicalSchedulingListResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Data inválida ou erro de validação.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente ou inválido.',
  })
  async getdailySchedulings(
    @CurrentUser() user: UserPayload | null,
    @Query('date') dateQuery?: string,
  ) {
    if (!user?.sub) {
      return mapDomainErrorToHttp(new MissingAuthenticatedUserError());
    }

    let inDate: Date;
    if (dateQuery) {
      const parsed = dayjsConfig(dateQuery);
      if (!parsed.isValid()) {
        return mapDomainErrorToHttp(new InvalidDateError());
      }
      inDate = parsed.startOf('day').toDate();
    } else {
      inDate = dayjs().startOf('day').toDate();
    }

    const schedulings = await this.getDailySchedulingsUseCase.execute({
      id: user.sub,
      date: inDate,
    });

    if (schedulings.isRight()) {
      return {
        schedulings: schedulings.value.schedulings,
      };
    }
  }
}
