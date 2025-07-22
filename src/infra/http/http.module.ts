import { Module } from '@nestjs/common';
import { MedicalSchedulerModule } from './controllers/medical-scheduler/medical-scheduler.module';
import { AuthenticateModule } from './controllers/auth/authenticate.module';
import { ExamsModules } from './controllers/exams/exams.module';

@Module({
  imports: [MedicalSchedulerModule, AuthenticateModule, ExamsModules],
  exports: [MedicalSchedulerModule, AuthenticateModule, ExamsModules],
})
export class HttpModule {}
