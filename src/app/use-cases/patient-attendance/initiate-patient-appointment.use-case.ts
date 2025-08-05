import { AttendanceRepository } from '@/app/repositories/attendance.repository';
import { DomainEvents } from '@/core/events/domain-events';
import { UniqueID } from '@/core/object-values/unique-id';
import { Injectable } from '@nestjs/common';

interface IInitiatePatientAppointmentRequest {
  id: UniqueID;
}

@Injectable()
export class InitiatePatientAppointmentUseCase {
  constructor(private readonly repo: AttendanceRepository) {}

  async execute({ id }: IInitiatePatientAppointmentRequest) {
    const result = await this.repo.findByAttendanceId(id.toString());
    if (!result) return null;

    result.start();
    DomainEvents.dispatchEventsForAggregate(result.id);
    return result;
  }
}
