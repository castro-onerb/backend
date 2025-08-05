import { Injectable } from '@nestjs/common';
import { RedisService } from '@/infra/redis/redis.service';

@Injectable()
export class SessionRedisService {
  constructor(private readonly redis: RedisService) {}

  async activateSession(sessionId: string, ttlInSeconds: number) {
    await this.redis.set(`session:${sessionId}`, 'active', ttlInSeconds);
  }

  async isSessionActive(sessionId: string): Promise<boolean> {
    const exists = await this.redis.exists(`session:${sessionId}`);
    return typeof exists === 'number' && exists === 1;
  }

  async invalidateSession(sessionId: string) {
    await this.redis.del(`session:${sessionId}`);
  }
}
