import {
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { TokenService } from '@/infra/auth/auth.service';
import { formatName } from '@/core/utils/format-name';
import { z } from 'zod';

const cookieSchema = z.object({
  refresh_token: z.string(),
});

@ApiTags('Auth')
@Controller('auth')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('me/refresh-token')
  @ApiOperation({
    summary: 'Renovar access token',
    description:
      'Gera um novo access token com base no refresh token presente no cookie `refresh_token`. Também renova o próprio refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Access token renovado com sucesso.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token de atualização ausente, inválido ou expirado.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Não conseguimos renovar o token de autenticação.',
        error: 'Unauthorized',
      },
    },
  })
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const cookies = cookieSchema.parse(req.cookies);
      const tokenFromCookie = cookies.refresh_token;

      const payload = this.tokenService.verifyRefreshToken(tokenFromCookie);

      const newAccessToken = this.tokenService.generateAccessToken({
        sub: payload.sub,
        name: formatName(payload.name).name,
        role: payload.role,
      });

      const newRefreshToken = this.tokenService.generateRefreshToken({
        sub: payload.sub,
        name: formatName(payload.name).name,
        role: payload.role,
      });

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        access_token: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException(
        'Não conseguimos renovar o token de autenticação.',
      );
    }
  }
}
