import { DomainEvent } from '@/core/events/domain-event';
import { UniqueID } from '@/core/object-values/unique-id';

interface NewAccessRequest {
  aggregateId: UniqueID;
  email: string;
  ip?: string;
}

export class NewAccessAccount implements DomainEvent {
  ocurredAt: Date;
  aggregateId: UniqueID;
  email: string;
  ip?: string;

  constructor(props: NewAccessRequest) {
    this.aggregateId = props.aggregateId;
    this.ocurredAt = new Date();
    this.email = props.email;
    this.ip = props.ip;
  }
}
