import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicalModule } from './modules/medical.module';
import { AuthModule } from './auth/auth.module';
import { EnvModule } from './env/env.module';
import { DatabaseModule } from './database/database.module';
import { OperatorModule } from './modules/operator.module';
import { AdaptersModule } from './adapters/adapters.module';
import { AuthHttpModule } from './modules/auth-http.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MedicalModule,
    OperatorModule,
    EnvModule,
    AuthModule,
    AuthHttpModule,
    DatabaseModule,
    AdaptersModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 5,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
