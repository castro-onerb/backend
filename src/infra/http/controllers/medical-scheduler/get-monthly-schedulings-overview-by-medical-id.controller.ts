import { GetMonthlySchedulingsOverviewByMedicalIdUseCase } from '@/app/use-cases/medical-scheduler/get-monthly-schedulings-overview-by-medical-id';
import dayjs from '@/core/config/dayjs.config';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('medical')
export class GetMonthlySchedulingsOverviewByMedicalIdController {
  constructor(
    private readonly getMonthlySchedulingsOverviewByMedicalId: GetMonthlySchedulingsOverviewByMedicalIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('monthly-overview-schedulings')
  async getdailySchedulings(
    @CurrentUser() user: UserPayload | null,
    @Query('start') startQuery?: string,
    @Query('end') endQuery?: string,
  ) {
    if (!user?.sub) {
      return mapDomainErrorToHttp(
        new BadRequestException(
          'Não conseguimos acesso ao seu perfil, verifique seu login e tente novamente.',
        ),
      );
    }

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (startQuery) {
      const parsed = dayjs(startQuery);
      if (!parsed.isValid()) {
        return mapDomainErrorToHttp(
          new BadRequestException('A data de início fornecida é inválida.'),
        );
      }
      startDate = parsed.startOf('day').toDate();
    }

    if (endQuery) {
      const parsed = dayjs(endQuery);
      if (!parsed.isValid()) {
        return mapDomainErrorToHttp(
          new BadRequestException('A data de fim fornecida é inválida.'),
        );
      }
      endDate = parsed.endOf('day').toDate();
    }

    const result = await this.getMonthlySchedulingsOverviewByMedicalId.execute({
      id: user.sub,
      start: startDate,
      end: endDate,
    });

    if (result.isRight()) {
      return result.value;
    }
  }
}
