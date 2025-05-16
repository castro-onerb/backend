import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicalModule } from './infra/modules/medical.module';
import { AuthModule } from './core/auth/auth.module';
import { EnvModule } from './infra/env/env.module';
import { DatabaseModule } from './infra/database/database.module';
import { OperatorModule } from './infra/modules/operator.module';
import { AdaptersModule } from './infra/adapters/adapters.module';
import { AuthHttpModule } from './infra/modules/auth-http.module';

@Module({
  imports: [
    MedicalModule,
    OperatorModule,
    EnvModule,
    AuthModule,
    AuthHttpModule,
    DatabaseModule,
    AdaptersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
