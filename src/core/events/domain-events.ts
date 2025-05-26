import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueID } from '../object-values/unique-id';
import { DomainEvent } from './domain-event';
import { EventHandler } from './event-handler';

export class DomainEvents {
  private static handlersMap: Record<string, EventHandler[]> = {};
  private static markedAggregates: AggregateRoot<unknown>[] = [];

  // ✅ REGISTRAR HANDLER PARA UM EVENTO
  public static register(eventName: string, handler: EventHandler): void {
    if (!this.handlersMap[eventName]) {
      this.handlersMap[eventName] = [];
    }

    this.handlersMap[eventName].push(handler);
  }

  // ✅ MARCAR ENTIDADE PARA DISPATCH
  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const alreadyMarked = !!this.findMarkedAggregateByID(aggregate.id);

    if (!alreadyMarked) {
      this.markedAggregates.push(aggregate);
    }
  }

  // ✅ DESPACHAR EVENTOS DE UMA ENTIDADE MARCADA
  public static dispatchEventsForAggregate(aggregateId: UniqueID) {
    const aggregate = this.findMarkedAggregateByID(aggregateId);

    if (!aggregate) {
      return;
    }

    this.dispatchAggregateEvents(aggregate);
    aggregate.clearEvents();
    this.removeAggregateFromMarkedDispatchList(aggregate);
  }

  private static findMarkedAggregateByID(
    id: UniqueID,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = this.markedAggregates.findIndex((a) =>
      a.id.equals(aggregate.id),
    );

    if (index !== -1) {
      this.markedAggregates.splice(index, 1);
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    const events = aggregate.domainEvents;

    for (const event of events) {
      this.dispatch(event);
    }
  }

  static dispatch(event: DomainEvent) {
    const eventName = event.constructor.name;

    const handlers = this.handlersMap[eventName] || [];

    for (const handler of handlers) {
      setTimeout(() => {
        handler
          .handle(event)
          .catch((err) =>
            console.error(
              `[DomainEvents] Error on handler for ${eventName}:`,
              err,
            ),
          );
      }, 0);
    }
  }
}
