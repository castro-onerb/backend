import { IpLocationService } from '@/core/services/ip-location.service';
import { TokenService } from '@/core/auth/auth.service';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CRM } from '@/core/object-values/crm';
import { MedicalAuthenticateUseCase } from '@/domain/professional/app/use-cases/authenticate-medical/authenticate-medical.use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Body, Controller, Post, Req, Res, UsePipes } from '@nestjs/common';
import { Request, Response } from 'express';
import { z } from 'zod';

const schemaBodyRequest = z.object({
  crm: z.string(),
  password: z.string(),
});

@Controller('auth')
export class MedicalAuthenticateController {
  constructor(
    private readonly authenticateUseCase: MedicalAuthenticateUseCase,
    private readonly tokenService: TokenService,
    private readonly ipLocationService: IpLocationService,
  ) {}

  @Post('medical')
  @UsePipes(new ZodValidationPipe(schemaBodyRequest))
  async login(
    @Body() body: { crm: string; password: string },
    @Req() req: Request, // adicione o Request
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

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      req.ip;

    if (ip) {
      try {
        const location = await this.ipLocationService.lookup(ip);
      } catch (err) {
        console.warn('Não foi possível localizar IP:', err.message);
      }
    }

    const medicalId = result.value.medical.id;
    const accessToken = this.tokenService.generateAccessToken({
      sub: medicalId,
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      sub: medicalId,
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
