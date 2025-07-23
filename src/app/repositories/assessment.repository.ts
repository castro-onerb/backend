import { IAssessmentProps } from '@/domain/patient/@types/assessment';

export abstract class AssessmentRepository {
  abstract findByAttendanceId(attendanceId: string): Promise<IAssessmentProps | null>;
} 