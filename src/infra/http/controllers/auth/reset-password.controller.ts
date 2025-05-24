import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { ResetPasswordUseCase } from '@/app/use-cases/auth/reset-password.use-case';
import { Password } from '@/core/object-values/password';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { ThrottlerGuard } from '@nestjs/throttler';

const schemaBodyRequest = z.object({
  email: z.string().email(),
  code: z.string().min(6),
  password: z.string(),
});

type requestBodyResetPassword = z.infer<typeof schemaBodyRequest>;

@Controller('auth')
export class ResetPasswordController {
  constructor(private readonly resetPassword: ResetPasswordUseCase) {}

  @Post('reset-password')
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ZodValidationPipe(schemaBodyRequest))
  async reset(@Body() body: requestBodyResetPassword) {
    const { email, code, password } = body;

    const passwordObj = Password.create(password);

    if (passwordObj.isLeft()) {
      return mapDomainErrorToHttp(passwordObj.value);
    }

    const result = await this.resetPassword.execute({
      email,
      code,
      password: passwordObj.value.getValue(),
    });

    if (result.isLeft()) {
      return mapDomainErrorToHttp(result.value);
    }
  }
}
