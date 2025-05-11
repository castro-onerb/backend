import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicalModule } from './infra/modules/medical.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './infra/env/env';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [
    MedicalModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
