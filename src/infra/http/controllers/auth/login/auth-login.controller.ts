import { SessionRedisService } from './../redis/session-redis.service';
import { TokenService } from '@/infra/auth/auth.service';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CRM } from '@/core/object-values/crm';
import { MedicalAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-medical.use-case';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { seconds, Throttle } from '@nestjs/throttler';
import { formatName } from '@/core/utils/format-name';
import { OperatorAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-operator.use-case';
import { PatientAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-patient.use-case';
import { Medical } from '@/domain/professional/entities/medical.entity';
import { Operator } from '@/domain/professional/entities/operator.entity';
import { Patient } from '@/domain/patient/entities/patient.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto, UserType } from './types/login.dto';
import { AuthLoginResponse } from './types/auth-login-response.dto';
import { ActiveSessionRepository } from '@/app/repositories/active-session.repository';
import { DomainEvents } from '@/core/events/domain-events';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly medicalAuthUseCase: MedicalAuthenticateUseCase,
    private readonly operatorAuthUseCase: OperatorAuthenticateUseCase,
    private readonly patientAuthUseCase: PatientAuthenticateUseCase,
    private readonly tokenService: TokenService,
    private readonly activeSessionRepository: ActiveSessionRepository,
    private readonly sessionRedis: SessionRedisService,
  ) {}

  @Throttle({ login: { limit: 3, ttl: seconds(60) } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({
    summary: 'Login.',
    description: 'Limitado a 3 requisições por minuto por IP.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthLoginResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro na validação dos dados fornecidos.',
    schema: {
      example: {
        statusCode: 400,
        message:
          'Hmm... não conseguimos reconhecer esse CRM. Verifique se está no formato certo.',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'As credenciais fornecidas não são válidas',
    schema: {
      example: {
        statusCode: 401,
        message:
          'Não conseguimos validar sua senha. Confira e tente novamente.',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum registro encontrado para os dados fornecidos.',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Não localizamos um médico com o CRM informado. Que tal conferir os dados?',
        error: 'Not Found',
      },
    },
  })
  async login(
    @Body()
    body: AuthLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (body.type === UserType.MEDICAL) {
      const crmResult = CRM.create(body.access);
      if (crmResult.isLeft()) {
        throw mapDomainErrorToHttp(crmResult.value);
      }

      const result = await this.medicalAuthUseCase.execute({
        crm: crmResult.value,
        password: body.password,
      });

      if (result.isLeft()) {
        throw mapDomainErrorToHttp(result.value);
      }

      const user = result.value.medical;
      return this.handleLogin(user, 'medical', req, res);
    }

    if (body.type === UserType.OPERATOR) {
      const result = await this.operatorAuthUseCase.execute({
        username: body.access,
        password: body.password,
      });

      if (result.isLeft()) {
        throw mapDomainErrorToHttp(result.value);
      }

      const user = result.value.operator;
      return this.handleLogin(user, 'operator', req, res);
    }

    if (body.type === UserType.PATIENT) {
      const result = await this.patientAuthUseCase.execute({
        cpf: body.access,
        password: body.password,
      });

      if (result.isLeft()) {
        throw mapDomainErrorToHttp(result.value);
      }

      const user = result.value.patient;
      return this.handleLogin(user, 'patient', req, res);
    }
  }

  private async handleLogin(
    user: Medical | Operator | Patient,
    role: 'medical' | 'operator' | 'patient',
    req: Request,
    res: Response,
  ) {
    const refreshToken = this.tokenService.generateRefreshToken({
      sub: user.id.toString(),
      name: formatName(user.name).name,
      role,
    });

    const session = await this.activeSessionRepository.create({
      userId: user.id.toString(),
      token: refreshToken,
      ip: req.ip,
      device: req.headers['user-agent'],
    });

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id.toString(),
      name: formatName(user.name).name,
      role,
      sessionId: session.id,
    });

    await this.sessionRedis.activateSession(session.id, 15 * 60);

    if (role === 'medical') {
      (user as Medical).recordAccess(session.id, req.ip);
      DomainEvents.dispatchEventsForAggregate(user.id);
    }

    if (role === 'operator') {
      (user as Operator).recordAccess(session.id, req.ip);
      DomainEvents.dispatchEventsForAggregate(user.id);
    }

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      // sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: accessToken,
    };
  }
}
