import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { OperatorAuthenticateUseCase } from '@/domain/professional/app/use-cases/authenticate-operator/authenticate-operator.use-case';
import { Env } from '@/infra/env/env';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { z } from 'zod';

const schemaBodyRequest = z.object({
  username: z.string(),
  password: z.string(),
});

@Controller('auth')
export class OperatorAuthenticateController {
  constructor(
    private readonly authenticateUseCase: OperatorAuthenticateUseCase,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @Post('operator')
  @UsePipes(new ZodValidationPipe(schemaBodyRequest))
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;

    const result = await this.authenticateUseCase.execute({
      username,
      password,
    });

    if (result.isLeft()) {
      return mapDomainErrorToHttp(result.value);
    }

    const accessToken = this.jwt.sign(
      { sub: result.value.operator.id },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwt.sign(
      { sub: result.value.operator.id },
      {
        expiresIn: '7d',
        privateKey: Buffer.from(this.config.get('JWT_SECRET_KEY'), 'base64'),
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
