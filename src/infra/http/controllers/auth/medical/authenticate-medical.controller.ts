import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CRM } from '@/core/object-values/crm';
import { MedicalAuthenticateUseCase } from '@/domain/professional/app/use-cases/authenticate-medical/authenticate-medical.use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
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
      return mapDomainErrorToHttp(crmValid.value);
    }

    const result = await this.authenticateUseCase.execute({
      crm: crmValid.value,
      password,
    });

    if (result.isLeft()) {
      return mapDomainErrorToHttp(result.value);
    }

    return {
      result,
    };
  }
}
