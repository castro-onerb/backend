import { InitiatePatientAppointmentUseCase } from '@/app/use-cases/patient-attendance/initiate-patient-appointment.use-case';
import { Module } from '@nestjs/common';
import { InitiatePatientAppointmentController } from './initiate-patient-appointment.controller';
import { AttendanceRedisService } from './redis/attendance-redis.service';
import { AttendanceFlowService } from './services/attendance-flow.service';
import { FetchAttendancesInitializedController } from './fetch-attendances-initialized.controller';

@Module({
  controllers: [
    InitiatePatientAppointmentController,
    FetchAttendancesInitializedController,
  ],
  providers: [
    InitiatePatientAppointmentUseCase,
    AttendanceRedisService,
    AttendanceFlowService,
  ],
})
export class AttendanceModule {}
