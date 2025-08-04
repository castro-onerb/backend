import { Module } from '@nestjs/common';
import { MedicalSchedulerModule } from './controllers/medical-scheduler/medical-scheduler.module';
import { AuthenticateModule } from './controllers/auth/authenticate.module';
import { ExamsModules } from './controllers/exams/exams.module';
import { AssessmentModule } from './controllers/assessment/assessment.module';
import { AttendanceModule } from './controllers/attendance/attendance.module';

@Module({
  imports: [
    MedicalSchedulerModule,
    AuthenticateModule,
    ExamsModules,
    AssessmentModule,
    AttendanceModule,
  ],
  exports: [
    MedicalSchedulerModule,
    AuthenticateModule,
    ExamsModules,
    AssessmentModule,
    AttendanceModule,
  ],
})
export class HttpModule {}
