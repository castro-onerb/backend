import { TokenService } from '@/infra/auth/auth.service';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { OperatorAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-operator.use-case';
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
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { z } from 'zod';
import { formatName } from '@/core/utils/format-name';

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

  @Post('login/operator')
  @UseGuards(ThrottlerGuard)
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

    const operatorId = result.value.operator.id;
    const accessToken = this.tokenService.generateAccessToken({
      sub: operatorId.toString(),
      name: formatName(result.value.operator.name).name,
      role: 'operator',
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      sub: operatorId.toString(),
      name: formatName(result.value.operator.name).name,
      role: 'operator',
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
