import { Either, left, right } from '@/core/either';
import { IAssessmentProps } from '@/domain/patient/@types/assessment';
import { Injectable } from '@nestjs/common';
import { AssessmentRepository } from '@/app/repositories/assessment.repository';
import { PatientRepository } from '@/app/repositories/patient.repository';
import { MedicalRepository } from '@/app/repositories/medical.repository';
import { OperatorRepository } from '@/app/repositories/operator.repository';
import { DatabaseUnavailableError } from '@/core/errors/database-unavailable.error';
import { AssessmentNotFoundError, UnauthorizedAssessmentAccessError } from '@/core/errors/assessment.errors';

export interface FetchAssessmentByAttendanceIdUseCaseRequest {
    attendanceId: string;
    currentUserId: string;
    currentUserRole: 'medical' | 'operator' | 'patient';
}

export type FetchAssessmentByAttendanceIdUseCaseResponse = Either<
    DatabaseUnavailableError | AssessmentNotFoundError | UnauthorizedAssessmentAccessError,
    {
        assessment: IAssessmentProps;
    }
>;

@Injectable()
export class FetchAssessmentByAttendanceIdUseCase {
    constructor(
        private readonly assessmentRepository: AssessmentRepository,
        private readonly patientRepository: PatientRepository,
        private readonly medicalRepository: MedicalRepository,
        private readonly operatorRepository: OperatorRepository,
    ) { }

    async execute({
        attendanceId,
        currentUserId,
        currentUserRole,
    }: FetchAssessmentByAttendanceIdUseCaseRequest): Promise<FetchAssessmentByAttendanceIdUseCaseResponse> {
        try {
            // Busca a triagem
            const assessment = await this.assessmentRepository.findByAttendanceId(attendanceId);

            if (!assessment) {
                return left(new AssessmentNotFoundError());
            }

            // Valida autorização baseada no role do usuário
            const isAuthorized = await this.validateUserAccess(
                currentUserId,
                currentUserRole,
                assessment.patientId,
            );

            if (!isAuthorized) {
                return left(new UnauthorizedAssessmentAccessError());
            }

            return right({
                assessment,
            });
        } catch (error) {
            console.error('[FetchAssessmentByAttendanceId] Erro:', error);
            return left(new DatabaseUnavailableError());
        }
    }

    private async validateUserAccess(
        currentUserId: string,
        currentUserRole: 'medical' | 'operator' | 'patient',
        assessmentPatientId: string,
    ): Promise<boolean> {
        // Se for médico ou operador, pode acessar qualquer triagem
        if (currentUserRole === 'medical' || currentUserRole === 'operator') {
            return true;
        }

        // Se for paciente, só pode acessar suas próprias triagens
        if (currentUserRole === 'patient') {
            return currentUserId === assessmentPatientId;
        }

        return false;
    }
} 