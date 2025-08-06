import { AttendanceRepository } from '@/app/repositories/attendance.repository';
import { DomainEvents } from '@/core/events/domain-events';
import { Either, left, right } from '@/core/either';
import { UniqueID } from '@/core/object-values/unique-id';
import { Injectable } from '@nestjs/common';
import { Attendance } from '@/domain/attendance/entities/attendance.entity';
import { AttendanceInvalidStartError } from '@/domain/errors';
import { AttendanceNotFoundError } from './errors';

interface IInitiatePatientAppointmentRequest {
  id: UniqueID;
}

export type InitiatePatientAppointmentUseCaseResponse = Either<
  AttendanceNotFoundError | AttendanceInvalidStartError,
  { attendance: Attendance }
>;

@Injectable()
export class InitiatePatientAppointmentUseCase {
  constructor(private readonly repo: AttendanceRepository) {}

  async execute({
    id,
  }: IInitiatePatientAppointmentRequest): Promise<InitiatePatientAppointmentUseCaseResponse> {
    const attendance = await this.repo.findByAttendanceId(id.toString());

    if (!attendance) {
      return left(new AttendanceNotFoundError());
    }

    try {
      attendance.start();
    } catch (error) {
      if (error instanceof AttendanceInvalidStartError) {
        return left(error);
      }
      throw error;
    }

    await this.repo.update(attendance);
    DomainEvents.dispatchEventsForAggregate(attendance.id);

    return right({ attendance });
  }
}
