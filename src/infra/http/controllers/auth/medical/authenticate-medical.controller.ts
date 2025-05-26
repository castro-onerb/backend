import { TokenService } from '@/infra/auth/auth.service';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CRM } from '@/core/object-values/crm';
import { MedicalAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-medical.use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { z } from 'zod';
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
  ) {}

  @Post('login/medical')
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

    const medicalId = result.value.medical.id;
    const accessToken = this.tokenService.generateAccessToken({
      sub: medicalId.toString(),
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      sub: medicalId.toString(),
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: '/auth/refresh-token',
    });

    return {
      access_token: accessToken,
    };
  }
}
