import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EnvModule } from './env/env.module';
import { AdaptersModule } from './adapters/adapters.module';
import { AuthenticateModule } from './http/controllers/auth/authenticate.module';
import {
  seconds,
  ThrottlerModule,
  ThrottlerStorageService,
} from '@nestjs/throttler';
import { EventsModule } from './events/events.module';
import { DatabaseModule } from './database/database.module';
import { HttpModule } from './http/http.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';

@Module({
  imports: [
    EventsModule,
    EnvModule,
    HttpModule,
    AuthenticateModule,
    AuthModule,
    AdaptersModule,
    DatabaseModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            ttl: seconds(60),
            limit: 10,
          },
        ],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ThrottlerStorageService],
})
export class AppModule {}
