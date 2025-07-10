import { AuthenticatePatientUseCase } from '@/app/use-cases/auth/authenticate-patient.use-case';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { formatName } from '@/core/utils/format-name';
import { TokenService } from '@/infra/auth/auth.service';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { z } from 'zod';

const schemaBodyRequest = z.object({
  cpf: z.string(),
  password: z.string(),
});

@Controller('auth')
export class PatientAuthenticateController {
  constructor(
    private readonly patientAuthenticateUseCase: AuthenticatePatientUseCase,
    private readonly tokenService: TokenService,
  ) {}

  @Post('login/patient')
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ZodValidationPipe(schemaBodyRequest))
  async login(
    @Body() body: { cpf: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { cpf, password } = body;

    const result = await this.patientAuthenticateUseCase.execute({
      cpf,
      password,
    });

    if (result.isLeft()) {
      return mapDomainErrorToHttp(result.value);
    }

    const patientId = result.value.patient.id;
    const accessToken = this.tokenService.generateAccessToken({
      sub: patientId.toString(),
      name: formatName(result.value.patient.name).name,
      role: 'patient',
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      sub: patientId.toString(),
      name: formatName(result.value.patient.name).name,
      role: 'patient',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      // path: '/auth/refresh-token',
    });

    return {
      access_token: accessToken,
    };
  }
}
