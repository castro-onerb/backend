import { InitiatePatientAppointmentUseCase } from '@/app/use-cases/patient-attendance/initiate-patient-appointment.use-case';
import { UniqueID } from '@/core/object-values/unique-id';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import {
  MissingAuthenticatedUserError,
  UnauthorizedPermissionError,
} from '../errors';
import { InitiatePatientAppointmentDto } from './types/initiate-patient-appointment.dto';

@ApiTags('Attendance')
@Controller('attendance')
export class InitiatePatientAppointmentController {
  constructor(private readonly useCase: InitiatePatientAppointmentUseCase) {}

  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: InitiatePatientAppointmentDto })
  @Post('start')
  async initiateAttendance(
    @Body() body: InitiatePatientAppointmentDto,
    @CurrentUser() user: UserPayload | null,
  ) {
    if (!user?.sub) {
      throw mapDomainErrorToHttp(new MissingAuthenticatedUserError());
    }

    if (user.role !== 'medical') {
      throw mapDomainErrorToHttp(new UnauthorizedPermissionError());
    }

    const { attendance_id } = body;

    const result = await this.useCase.execute({
      id: new UniqueID(attendance_id),
    });

    return {
      attendance: result,
    };
  }
}
