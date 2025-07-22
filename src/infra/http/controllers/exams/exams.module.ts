import { Module } from '@nestjs/common';
import { FetchExamsByPatientController } from './fetch-exams-by-patient.controller';
import { FetchExamsByPatientUseCase } from '@/app/use-cases/patient-exam/fetch-exams-by-patient.use-case';
import { DatabaseModule } from '@/infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FetchExamsByPatientController],
  providers: [FetchExamsByPatientUseCase],
})
export class ExamsModules {}
