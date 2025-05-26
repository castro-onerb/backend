import { DomainEvent } from '@/core/events/domain-event';
import { UniqueID } from '@/core/object-values/unique-id';

export class PasswordRecoveryRequested implements DomainEvent {
  ocurredAt: Date;
  aggregateId: UniqueID;
  email: string;
  name: string;
  code: string;

  constructor(props: {
    aggregateId: UniqueID;
    email: string;
    name: string;
    code: string;
  }) {
    this.aggregateId = props.aggregateId;
    this.ocurredAt = new Date();
    this.email = props.email;
    this.name = props.name;
    this.code = props.code;
  }
}
