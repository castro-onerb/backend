import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    });

    this.client.on('connect', () => console.log('[Redis] Conectado'));
    this.client.on('error', (err) => console.error('[Redis] Erro:', err));
  }

  onModuleDestroy() {
    this.client?.disconnect();
  }

  getClient(): Redis {
    return this.client;
  }

  async set(
    key: string,
    value: string,
    ttlInSeconds?: number,
  ): Promise<string | null> {
    if (typeof ttlInSeconds === 'number') {
      return this.client.set(key, value, 'EX', ttlInSeconds);
    }

    return this.client.set(key, value);
  }

  async get(...args: Parameters<Redis['get']>) {
    return this.client.get(...args);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }
}
