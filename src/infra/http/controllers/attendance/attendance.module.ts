import { InitiatePatientAppointmentUseCase } from '@/app/use-cases/patient-attendance/initiate-patient-appointment.use-case';
import { Module } from '@nestjs/common';
import { InitiatePatientAppointmentController } from './initiate-patient-appointment.controller';

@Module({
  controllers: [InitiatePatientAppointmentController],
  providers: [InitiatePatientAppointmentUseCase],
})
export class AttendanceModule {}
