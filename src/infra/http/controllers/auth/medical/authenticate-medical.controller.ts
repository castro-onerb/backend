import { left } from '@/core/either';
import { CRM } from '@/core/object-values/crm';
import { MedicalAuthenticateUseCase } from '@/domain/professional/app/use-cases/authenticate-medical/authenticate-medical.use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';

const schemaBodyRequest = z.object({
  crm: z.string(),
  password: z.string(),
});

@Controller('auth')
export class MedicalAuthenticateController {
  constructor(
    private readonly authenticateUseCase: MedicalAuthenticateUseCase,
  ) {}

  @Post('medical')
  @UsePipes(new ZodValidationPipe(schemaBodyRequest))
  async login(@Body() body: { crm: string; password: string }) {
    const { crm, password } = body;

    const crmValid = CRM.create(crm);

    if (crmValid.isLeft()) {
      return left(
        new BadRequestException(
          'Hmm... não conseguimos reconhecer esse CRM. Verifique se está no formato certo.',
        ),
      );
    }

    const result = await this.authenticateUseCase.execute({
      crm: crmValid.value,
      password,
    });

    return {
      result,
    };
  }
}
