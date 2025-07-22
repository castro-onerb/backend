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

@Controller('medical')
export class GetDailySchedulingsController {
  constructor(
    private readonly getDailySchedulingsUseCase: GetDailySchedulingsByMedicalIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('daily-schedulings')
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
      id: user?.sub,
      date: inDate,
    });
    return schedulings;
  }
}
