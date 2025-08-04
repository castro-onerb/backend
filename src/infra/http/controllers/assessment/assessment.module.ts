import { Module } from '@nestjs/common';
import { FetchAssessmentByAttendanceIdController } from './fetch-assessment-by-attendance-id.controller';
import { FetchAssessmentByAttendanceIdUseCase } from '@/app/use-cases/assessment/fetch-assessment-by-attendance-id.use-case';

@Module({
  controllers: [FetchAssessmentByAttendanceIdController],
  providers: [FetchAssessmentByAttendanceIdUseCase],
})
export class AssessmentModule {}
