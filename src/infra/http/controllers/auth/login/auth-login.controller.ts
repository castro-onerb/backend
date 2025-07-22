import { TokenService } from '@/infra/auth/auth.service';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CRM } from '@/core/object-values/crm';
import { MedicalAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-medical.use-case';
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { formatName } from '@/core/utils/format-name';
import { OperatorAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-operator.use-case';
import { PatientAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-patient.use-case';
import { Medical } from '@/domain/professional/entities/medical.entity';
import { Operator } from '@/domain/professional/entities/operator.entity';
import { Patient } from '@/domain/patient/entities/patient.entity';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './types/login.dto';
import { AuthLoginResponse } from './types/auth-login-response.dto';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly medicalAuthUseCase: MedicalAuthenticateUseCase,
    private readonly operatorAuthUseCase: OperatorAuthenticateUseCase,
    private readonly patientAuthUseCase: PatientAuthenticateUseCase,
    private readonly tokenService: TokenService,
  ) {}

  @Post('login')
  @ApiBody({ type: AuthLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthLoginResponse,
  })
  @ApiResponse({ status: 400, description: 'Erro de validação' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(
    @Body()
    body: {
      type: 'medical' | 'operator' | 'patient';
      access: string;
      password: string;
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (body.type === 'medical') {
      const crmResult = CRM.create(body.access);
      if (crmResult.isLeft()) {
        return mapDomainErrorToHttp(crmResult.value);
      }

      const result = await this.medicalAuthUseCase.execute({
        crm: crmResult.value,
        password: body.password,
      });

      if (result.isLeft()) {
        return mapDomainErrorToHttp(result.value);
      }

      const user = result.value.medical;

      return this.handleLogin(user, 'medical', res);
    }

    if (body.type === 'operator') {
      const result = await this.operatorAuthUseCase.execute({
        username: body.access,
        password: body.password,
      });

      if (result.isLeft()) {
        return mapDomainErrorToHttp(result.value);
      }

      const user = result.value.operator;

      return this.handleLogin(user, 'operator', res);
    }

    if (body.type === 'patient') {
      const result = await this.patientAuthUseCase.execute({
        cpf: body.access,
        password: body.password,
      });

      if (result.isLeft()) {
        return mapDomainErrorToHttp(result.value);
      }

      const user = result.value.patient;

      return this.handleLogin(user, 'patient', res);
    }

    // fallback (inútil, mas para satisfazer o tipo)
    return mapDomainErrorToHttp(new Error('Invalid type'));
  }

  private handleLogin(
    user: Medical | Operator | Patient,
    role: 'medical' | 'operator' | 'patient',
    res: Response,
  ) {
    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id.toString(),
      name: formatName(user.name).name,
      role,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      sub: user.id.toString(),
      name: formatName(user.name).name,
      role,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: accessToken,
    };
  }
}
