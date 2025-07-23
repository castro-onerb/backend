import { FetchExamsByPatientUseCase } from '@/app/use-cases/patient-exam/fetch-exams-by-patient.use-case';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { MissingAuthenticatedUserError } from '../errors';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Exams')
@Controller('patient')
export class FetchExamsByPatientController {
  constructor(
    private readonly fetchExamsByPatientUseCase: FetchExamsByPatientUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/exams')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar exames do paciente autenticado',
    description:
      'Retorna a lista de exames do paciente autenticado com base no token JWT.',
  })
  @ApiOkResponse({
    description: 'Lista de exames retornada com sucesso.',
    schema: {
      example: {
        exams: [
          {
            id: 'exam123',
            patientId: 'abc123',
            procedure: 'Hemograma',
            scheduledDate: '2025-07-20T14:00:00Z',
            status: 'finalized',
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token JWT inválido.',
        error: 'Unauthorized',
      },
    },
  })
  async fetchExams(@CurrentUser() user: UserPayload | null) {
    if (!user?.sub) {
      return mapDomainErrorToHttp(new MissingAuthenticatedUserError());
    }

    const exams = await this.fetchExamsByPatientUseCase.execute({
      patientId: user.sub,
      page: 1,
    });

    return {
      exams: exams.isRight() ? exams.value.exams : [],
    };
  }
}
