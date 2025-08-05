import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type Redis from 'ioredis';

@Injectable()
export class SessionRedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async activateSession(sessionId: string, ttlInSeconds: number) {
    await this.redis.set(`session:${sessionId}`, 'active', 'EX', ttlInSeconds);
  }

  async isSessionActive(sessionId: string): Promise<boolean> {
    const exists = await this.redis.exists(`session:${sessionId}`);
    return exists === 1;
  }

  async invalidateSession(sessionId: string) {
    await this.redis.del(`session:${sessionId}`);
  }
}
