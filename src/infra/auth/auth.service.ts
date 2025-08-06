import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/infra/env/env';
import { z } from 'zod';

const accessTokenSchema = z.object({
  sub: z.string(),
  name: z.string(),
  role: z.enum(['medical', 'operator', 'patient']),
  sessionId: z.string(),
});

type JwtPayloadAccessToken = z.infer<typeof accessTokenSchema>;

export const refreshTokenSchema = z.object({
  sub: z.string(),
  name: z.string(),
  role: z.enum(['medical', 'operator', 'patient']),
  iat: z.number(),
  exp: z.number(),
});

type JwtPayloadRefreshoken = z.infer<typeof refreshTokenSchema>;

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  generateAccessToken(payload: JwtPayloadAccessToken & { sessionId: string }) {
    const validPayload = accessTokenSchema
      .extend({ sessionId: z.string() })
      .parse(payload);
    return this.jwtService.sign(validPayload, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(payload: object) {
    const privateKey = this.config.get('JWT_SECRET_KEY', { infer: true });
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      privateKey: Buffer.from(privateKey, 'base64'),
      algorithm: 'RS256',
    });
  }

  verifyRefreshToken(token: string): JwtPayloadRefreshoken {
    const publicKey = this.config.get('JWT_PUBLIC_KEY', { infer: true });

    const payload = this.jwtService.verify<Record<string, unknown>>(token, {
      publicKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });

    return refreshTokenSchema.parse(payload);
  }
}
