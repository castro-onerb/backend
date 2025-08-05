import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from 'src/infra/env/env';
import { z } from 'zod';
import { SessionRedisService } from '../http/controllers/auth/redis/session-redis.service';

const tokenPayloadSchema = z.object({
  sub: z.string(),
  name: z.string().optional(),
  role: z.enum(['medical', 'operator', 'patient']),
  iat: z.number(),
  exp: z.number(),
  sessionId: z.string(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService<Env, true>,
    private readonly sessionRedis: SessionRedisService,
  ) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: UserPayload) {
    const parsed = tokenPayloadSchema.parse(payload);

    try {
      const sessionIsValid = await this.sessionRedis.isSessionActive(
        parsed.sessionId,
      );
      if (!sessionIsValid) {
        throw new UnauthorizedException('Sessão inválida ou expirada');
      }
    } catch (err) {
      console.error('Erro ao validar sessão no Redis:', err);
      throw new UnauthorizedException('Falha na validação da sessão');
    }

    return parsed;
  }
}
