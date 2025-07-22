import { FetchExamsByPatientUseCase } from '@/app/use-cases/patient-exam/fetch-exams-by-patient.use-case';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

@Controller('patient')
export class FetchExamsByPatientController {
  constructor(
    private readonly fetchExamsByPatientUseCase: FetchExamsByPatientUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('exams')
  async fetchExams(@CurrentUser() user: UserPayload | null) {
    if (!user?.sub) {
      return mapDomainErrorToHttp(
        new BadRequestException(
          'Não conseguimos acesso ao seu perfil, verifique seu login e tente novamente.',
        ),
      );
    }

    const exams = await this.fetchExamsByPatientUseCase.execute({
      patientId: user.sub,
      page: 1,
    });

    if (exams.isRight()) {
      return {
        exams: exams.value.exams,
      };
    }

    return {
      exams: [],
    };
  }
}
