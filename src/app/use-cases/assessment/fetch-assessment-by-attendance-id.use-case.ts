import { Either, left, right } from '@/core/either';
import { IAssessmentProps } from '@/domain/patient/@types/assessment';
import { Injectable } from '@nestjs/common';
import { AssessmentRepository } from '@/app/repositories/assessment.repository';
import { DatabaseUnavailableError } from '@/core/errors/database-unavailable.error';
import {
  AssessmentNotFoundError,
  UnauthorizedAssessmentAccessError,
} from './errors';

export interface FetchAssessmentByAttendanceIdUseCaseRequest {
  attendanceId: string;
  currentUserId: string;
  currentUserRole: 'medical' | 'operator' | 'patient';
}

export type FetchAssessmentByAttendanceIdUseCaseResponse = Either<
  | DatabaseUnavailableError
  | AssessmentNotFoundError
  | UnauthorizedAssessmentAccessError,
  {
    assessment: IAssessmentProps;
  }
>;

@Injectable()
export class FetchAssessmentByAttendanceIdUseCase {
  constructor(private readonly assessmentRepository: AssessmentRepository) {}

  async execute({
    attendanceId,
    currentUserId,
    currentUserRole,
  }: FetchAssessmentByAttendanceIdUseCaseRequest): Promise<FetchAssessmentByAttendanceIdUseCaseResponse> {
    try {
      const assessment =
        await this.assessmentRepository.findByAttendanceId(attendanceId);

      if (!assessment) {
        return left(new AssessmentNotFoundError());
      }

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
    } catch {
      return left(new DatabaseUnavailableError());
    }
  }

  private async validateUserAccess(
    currentUserId: string,
    currentUserRole: 'medical' | 'operator' | 'patient',
    assessmentPatientId: string,
  ): Promise<boolean> {
    if (currentUserRole === 'medical') {
      return Promise.resolve(true);
    }

    if (currentUserRole === 'patient') {
      return currentUserId === assessmentPatientId;
    }

    return Promise.resolve(false);
  }
}
