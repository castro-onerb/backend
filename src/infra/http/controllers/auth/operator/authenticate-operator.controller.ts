import { TokenService } from '@/core/auth/auth.service';
import { MailEntity } from '@/core/entities/mail.entity';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { IpLocation } from '@/core/object-values/ip-location';
import { IpLocationService } from '@/core/services/ip-location.service';
import { OperatorAuthenticateUseCase } from '@/domain/professional/app/use-cases/authenticate-operator/authenticate-operator.use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { z } from 'zod';

const schemaBodyRequest = z.object({
  username: z.string(),
  password: z.string(),
});

@Controller('auth')
export class OperatorAuthenticateController {
  constructor(
    private readonly authenticateUseCase: OperatorAuthenticateUseCase,
    private readonly tokenService: TokenService,
    private readonly ipLocationService: IpLocationService,
    @Inject('MailEntity') private readonly mail: MailEntity,
  ) {}

  @Post('operator')
  @UsePipes(new ZodValidationPipe(schemaBodyRequest))
  async login(
    @Body() body: { username: string; password: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { username, password } = body;

    const result = await this.authenticateUseCase.execute({
      username,
      password,
    });

    if (result.isLeft()) {
      return mapDomainErrorToHttp(result.value);
    }

    const rawIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      req.ip;

    const ip =
      rawIp === '::1' || rawIp === '127.0.0.1' ? '206.42.45.142' : rawIp;
    let locationObject: IpLocation | null = null;

    const operatorId = result.value.operator.id;
    const accessToken = this.tokenService.generateAccessToken({
      sub: operatorId,
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      sub: operatorId,
    });

    const email = result.value.operator.email;

    if (ip) {
      try {
        locationObject = await this.ipLocationService.lookup(ip);
      } catch (err) {
        if (err instanceof Error) {
          console.warn('Não foi possível localizar IP:', err.message);
        } else {
          console.warn('Não foi possível localizar IP:', err);
        }
      }
    }

    let context: Record<string, any> = {};

    if (locationObject && email) {
      context = {
        city: locationObject.city,
        region: locationObject.region,
        country: locationObject.country,
      };
    }

    await this.mail.send({
      to: email,
      subject: 'Deovita - Alerta de segurança',
      template: 'auth/login-detected',
      context,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: '/auth/refresh-token',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
