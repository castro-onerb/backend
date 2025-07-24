import { FetchAssessmentByAttendanceIdUseCase } from '@/app/use-cases/assessment/fetch-assessment-by-attendance-id.use-case';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AssessmentResponseDto } from './types/assessment-response.dto';
import { IAssessmentProps } from '@/domain/patient/@types/assessment';

@ApiTags('Assessment')
@Controller('assessment')
export class FetchAssessmentByAttendanceIdController {
  constructor(
    private readonly fetchAssessmentUseCase: FetchAssessmentByAttendanceIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':attendance_id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar dados de triagem por ID do atendimento',
    description:
      'Retorna os dados completos de triagem vinculados a um atendimento específico. Acessível apenas para médicos, operadores ou para o próprio paciente.',
  })
  @ApiParam({
    name: 'attendance_id',
    description: 'ID único do atendimento (agenda_exames_id)',
    example: '123456',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'Dados de triagem retornados com sucesso',
    type: AssessmentResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Triagem não encontrada para o atendimento informado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Triagem não encontrada para o atendimento informado.',
        error: 'Not Found',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autorizado a acessar esta triagem',
    schema: {
      example: {
        statusCode: 401,
        message: 'Você não tem autorização para acessar esta triagem.',
        error: 'Unauthorized',
      },
    },
  })
  async fetchAssessment(
    @Param('attendance_id') attendanceId: string,
    @CurrentUser() user: UserPayload | null,
  ): Promise<AssessmentResponseDto> {
    if (!user?.sub || !user?.role) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    const result = await this.fetchAssessmentUseCase.execute({
      attendanceId,
      currentUserId: user.sub,
      currentUserRole: user.role,
    });

    if (result.isLeft()) {
      throw mapDomainErrorToHttp(result.value);
    }

    const { assessment } = result.value;

    return this.mapToResponse(assessment);
  }

  private mapToResponse(assessment: IAssessmentProps): AssessmentResponseDto {
    return {
      attendance_id: assessment.attendanceId,
      patient_id: assessment.patientId,
      weight: assessment.weight || null,
      height: assessment.height || null,
      blood_pressure: assessment.bloodPressure || null,
      heart_rate: assessment.heartRate || null,
      respiratory_rate: assessment.respiratoryRate || null,
      temperature: assessment.temperature || null,
      oxygen_saturation: assessment.oxygenSaturation || null,
      glycemia: assessment.glycemia || null,
      pressure_pattern: assessment.pressurePattern || null,
      chief_complaint: assessment.chiefComplaint || null,
      pain_score: assessment.painScore || null,
      pain_location: assessment.painLocation || null,
      pain_type: assessment.painType || null,
      pain_factors: assessment.painFactors || null,
      comorbidities: assessment.comorbidities || null,
      symptoms: assessment.symptoms || null,
    };
  }
}
