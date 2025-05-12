import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicalModule } from './infra/modules/medical.module';
import { AuthModule } from './core/auth/auth.module';
import { EnvModule } from './infra/env/env.module';
import { DatabaseModule } from './infra/database/database.module';

@Module({
  imports: [MedicalModule, EnvModule, AuthModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
