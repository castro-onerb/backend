import { Module } from '@nestjs/common';
import { MedicalSchedulerModule } from './controllers/medical-scheduler/medical-scheduler.module';
import { AuthenticateModule } from './controllers/auth/authenticate.module';

@Module({
  imports: [MedicalSchedulerModule, AuthenticateModule],
  exports: [MedicalSchedulerModule, AuthenticateModule],
})
export class HttpModule {}
