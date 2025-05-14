import { TokenService } from '@/core/auth/auth.service';
import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refresh-token')
  refreshToken(
    @Body() body: { refresh_token: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const payload = this.tokenService.verifyRefreshToken(body.refresh_token);

      const newAccessToken = this.tokenService.generateAccessToken({
        sub: payload.sub,
      });
      const newRefreshToken = this.tokenService.generateRefreshToken({
        sub: payload.sub,
      });

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        path: '/auth/refresh-token',
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException(
        'Não conseguimos renovar o token de autenticação.',
      );
    }
  }
}
