import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Env } from 'src/infra/env/env';

@Injectable()
export class PrismaClinicasService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private config: ConfigService<Env, true>) {
    const database_clinicas = config.get('DATABASE_CLINICAS_URL', {
      infer: true,
    });

    super({
      log: ['warn', 'error'],
      datasources: {
        db: {
          url: database_clinicas,
        },
      },
    });
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
  onModuleInit() {
    return this.$connect();
  }
}
