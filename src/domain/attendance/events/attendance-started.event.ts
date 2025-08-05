// attendance-started.event.ts
import { DomainEvent } from '@/core/events/domain-event';
import { UniqueID } from '@/core/object-values/unique-id';
import dayjs from '@/core/config/dayjs.config';

interface AttendanceStartedRequest {
  aggregateId: UniqueID;
  patientId: UniqueID;
  medicalId: UniqueID;
  procedureTussId: UniqueID;
  guideTicket: UniqueID;
  businessId: UniqueID;
  type: string;
}

export class AttendanceStarted implements DomainEvent {
  ocurredAt: Date;
  aggregateId: UniqueID;

  patientId: UniqueID;
  medicalId: UniqueID;
  procedureTussId: UniqueID;
  guideTicket: UniqueID;
  businessId: UniqueID;
  type: string;

  constructor(props: AttendanceStartedRequest) {
    this.aggregateId = props.aggregateId;
    this.ocurredAt = dayjs().toDate();

    this.patientId = props.patientId;
    this.medicalId = props.medicalId;
    this.procedureTussId = props.procedureTussId;
    this.guideTicket = props.guideTicket;
    this.businessId = props.businessId;
    this.type = props.type;
  }
}
