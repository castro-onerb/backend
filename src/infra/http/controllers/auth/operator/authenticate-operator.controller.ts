import { TokenService } from '@/core/auth/auth.service';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { OperatorAuthenticateUseCase } from '@/domain/professional/app/use-cases/authenticate-operator/authenticate-operator.use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
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
  ) {}

  @Post('operator')
  @UsePipes(new ZodValidationPipe(schemaBodyRequest))
  async login(
    @Body() body: { username: string; password: string },
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

    const operatorId = result.value.operator.id;
    const accessToken = this.tokenService.generateAccessToken({
      sub: operatorId,
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      sub: operatorId,
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
