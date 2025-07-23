import { GetMonthlySchedulingsOverviewByMedicalIdUseCase } from '@/app/use-cases/medical-scheduler/get-monthly-schedulings-overview-by-medical-id';
import dayjs from '@/core/config/dayjs.config';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MissingAuthenticatedUserError } from '../errors';
import { InvalidDateError } from '../errors/app.error';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Schedulers')
@Controller('medical')
export class GetMonthlySchedulingsOverviewByMedicalIdController {
  constructor(
    private readonly getMonthlySchedulingsOverviewByMedicalId: GetMonthlySchedulingsOverviewByMedicalIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('schedulings/overview/monthly')
  async getdailySchedulings(
    @CurrentUser() user: UserPayload | null,
    @Query('start') startQuery?: string,
    @Query('end') endQuery?: string,
  ) {
    if (!user?.sub) {
      return mapDomainErrorToHttp(new MissingAuthenticatedUserError());
    }

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (startQuery) {
      const parsed = dayjs(startQuery);
      if (!parsed.isValid()) {
        return mapDomainErrorToHttp(new InvalidDateError());
      }
      startDate = parsed.startOf('day').toDate();
    }

    if (endQuery) {
      const parsed = dayjs(endQuery);
      if (!parsed.isValid()) {
        return mapDomainErrorToHttp(new InvalidDateError());
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
