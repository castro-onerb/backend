import { FetchExamsByPatientUseCase } from '@/app/use-cases/patient-exam/fetch-exams-by-patient.use-case';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MissingAuthenticatedUserError } from '../errors';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { FetchExamsByPatientPresenter } from '../../presenters/exams/fetch-exams-by-patient.presenter';

@ApiTags('Exams')
@Controller('patient')
export class FetchExamsByPatientController {
  constructor(
    private readonly fetchExamsByPatientUseCase: FetchExamsByPatientUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({ app: { ttl: 60, limit: 2 } })
  @Get('me/exams')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar exames do paciente autenticado',
    description:
      'Retorna a lista de exames do paciente autenticado com base no token JWT.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número da página da listagem (padrão: 1)',
  })
  @ApiOkResponse({
    description: 'Lista de exames retornada com sucesso.',
    schema: {
      example: {
        exams: [
          {
            id: 'exam123',
            patient_id: 'abc123',
            procedure: 'Hemograma',
            scheduled_date: '2025-07-20T14:00:00Z',
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
  async fetchExams(
    @CurrentUser() user: UserPayload | null,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    if (!user?.sub) {
      return mapDomainErrorToHttp(new MissingAuthenticatedUserError());
    }

    const exams = await this.fetchExamsByPatientUseCase.execute({
      patientId: user.sub,
      page: page || 1,
    });

    return {
      exams: exams.isRight()
        ? FetchExamsByPatientPresenter.toHTTP(exams.value.exams)
        : [],
    };
  }
}
