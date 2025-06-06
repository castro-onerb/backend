import { Module } from '@nestjs/common';
import { FetchSchedulingsController } from './fetch-schedulings.controller';
import { FetchSchedulingsByMedicalIdUseCase } from '@/app/use-cases/medical-scheduler/fetch-schedulings-by-medical-id.use-case';

@Module({
  controllers: [FetchSchedulingsController],
  providers: [FetchSchedulingsByMedicalIdUseCase],
})
export class MedicalSchedulerModule {}
