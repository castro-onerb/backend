import { DomainEvent } from '@/core/events/domain-event';
import { UniqueID } from '@/core/object-values/unique-id';

export class PasswordRecoveryAttemptFailed implements DomainEvent {
  ocurredAt: Date;
  aggregateId: UniqueID;
  email: string;
  redirectUrl: string;

  constructor(props: { email: string; redirectUrl: string }) {
    this.aggregateId = new UniqueID();
    this.ocurredAt = new Date();
    this.email = props.email;
    this.redirectUrl = props.redirectUrl;
  }
}
