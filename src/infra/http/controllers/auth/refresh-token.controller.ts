import { TokenService } from '@/infra/auth/auth.service';
import {
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { z } from 'zod';

const cookieSchema = z.object({
  refresh_token: z.string(),
});

@Controller('auth')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refresh-token')
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      // const cookies = cookieSchema.parse(req.cookies);
      const cookies = cookieSchema.parse(req.cookies);
      const tokenFromCookie = cookies.refresh_token;

      if (!tokenFromCookie) {
        throw new UnauthorizedException('Token de atualização não encontrado.');
      }

      const payload = this.tokenService.verifyRefreshToken(tokenFromCookie);

      const newAccessToken = this.tokenService.generateAccessToken({
        sub: payload.sub,
        name: payload.name,
        role: payload.role,
      });
      const newRefreshToken = this.tokenService.generateRefreshToken({
        sub: payload.sub,
        name: payload.name,
        role: payload.role,
      });

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        // path: '/auth/refresh-token',
      });

      return {
        access_token: newAccessToken,
      };
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(
        'Não conseguimos renovar o token de autenticação.',
      );
    }
  }
}
