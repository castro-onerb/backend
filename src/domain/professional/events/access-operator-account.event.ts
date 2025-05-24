import { DomainEvent } from '@/core/events/domain-event';
import { UniqueID } from '@/core/object-values/unique-id';
import { Operator } from '../entities/operator.entity';

export class AccessOperatorAccountEvent implements DomainEvent {
  public operator: Operator;
  ocurredAt: Date;

  constructor(operator: Operator) {
    this.operator = operator;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueID {
    return this.operator.id;
  }
}
