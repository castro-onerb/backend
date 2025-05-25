import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/infra/env/env';
import { z } from 'zod';

const tokenSchema = z.object({
  sub: z.string(),
  iat: z.number(),
  exp: z.number(),
});

type JwtPayload = z.infer<typeof tokenSchema>;

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  generateAccessToken(payload: object) {
    return this.jwtService.sign(payload, {
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

  verifyRefreshToken(token: string): JwtPayload {
    const publicKey = this.config.get('JWT_PUBLIC_KEY', { infer: true });

    const payload = this.jwtService.verify<Record<string, unknown>>(token, {
      publicKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });

    return tokenSchema.parse(payload);
  }
}
