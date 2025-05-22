import { IpLocationService } from '@/core/services/ip-location.service';
import { TokenService } from '@/core/auth/auth.service';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CRM } from '@/core/object-values/crm';
import { MedicalAuthenticateUseCase } from '@/domain/professional/app/use-cases/authenticate-medical/authenticate-medical.use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { z } from 'zod';
import { MailEntity } from '@/core/entities/mail.entity';
import { IpLocation } from '@/core/object-values/ip-location';
import { ThrottlerGuard } from '@nestjs/throttler';

const schemaBodyRequest = z.object({
  crm: z.string(),
  password: z.string(),
});

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class MedicalAuthenticateController {
  constructor(
    private readonly authenticateUseCase: MedicalAuthenticateUseCase,
    private readonly tokenService: TokenService,
    private readonly ipLocationService: IpLocationService,
    @Inject('MailEntity') private readonly mail: MailEntity,
  ) {}

  @Post('medical')
  @UsePipes(new ZodValidationPipe(schemaBodyRequest))
  async login(
    @Body() body: { crm: string; password: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { crm, password } = body;

    const crmValid = CRM.create(crm);

    if (crmValid.isLeft()) {
      return mapDomainErrorToHttp(crmValid.value);
    }

    const result = await this.authenticateUseCase.execute({
      crm: crmValid.value,
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

    const medicalId = result.value.medical.id;
    const accessToken = this.tokenService.generateAccessToken({
      sub: medicalId,
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      sub: medicalId,
    });

    const email = result.value.medical.email;

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
      // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      maxAge: 1000 * 60 * 2, // 5 minutos
      path: '/auth/refresh-token',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
