import { FetchSchedulingsByMedicalIdUseCase } from '@/app/use-cases/medical-scheduler/fetch-schedulings-by-medical-id.use-case';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { MissingAuthenticatedUserError } from '../errors';

@Controller('medical')
export class FetchSchedulingsController {
  constructor(
    private readonly fetchSchedulingsUseCase: FetchSchedulingsByMedicalIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('fetch-schedulings')
  async fetchSchedulings(@CurrentUser() user: UserPayload | null) {
    if (!user?.sub) {
      return mapDomainErrorToHttp(new MissingAuthenticatedUserError());
    }

    const schedulings = await this.fetchSchedulingsUseCase.execute({
      id: user?.sub,
    });
    return schedulings;
  }
}
