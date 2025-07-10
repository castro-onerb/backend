import { Module } from '@nestjs/common';
import { FetchSchedulingsController } from './fetch-schedulings.controller';
import { FetchSchedulingsByMedicalIdUseCase } from '@/app/use-cases/medical-scheduler/fetch-schedulings-by-medical-id.use-case';
import { GetDailySchedulingsController } from './get-daily-schedulings.controller';
import { GetDailySchedulingsByMedicalIdUseCase } from '@/app/use-cases/medical-scheduler/get-daily-schedulings-by-medical.use-case';
import { GetMonthlySchedulingsOverviewByMedicalIdController } from './get-monthly-schedulings-overview-by-medical-id.controller';
import { GetMonthlySchedulingsOverviewByMedicalIdUseCase } from '@/app/use-cases/medical-scheduler/get-monthly-schedulings-overview-by-medical-id';

@Module({
  controllers: [
    FetchSchedulingsController,
    GetDailySchedulingsController,
    GetMonthlySchedulingsOverviewByMedicalIdController,
  ],
  providers: [
    FetchSchedulingsByMedicalIdUseCase,
    GetDailySchedulingsByMedicalIdUseCase,
    GetMonthlySchedulingsOverviewByMedicalIdUseCase,
  ],
})
export class MedicalSchedulerModule {}
