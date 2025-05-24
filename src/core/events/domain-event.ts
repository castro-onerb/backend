import { UniqueID } from '../object-values/unique-id';

export interface DomainEvent {
  ocurredAt: Date;
  getAggregateId(): UniqueID;
}
