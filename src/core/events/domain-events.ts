import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueID } from '../object-values/unique-id';
import { DomainEvent } from './domain-event';

type DomainEventCallback = (event: unknown) => void;

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {};
  private static markedAggregates: AggregateRoot<unknown>[] = [];

  public static shouldRun = true;

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  private static async dispatchAggregateEvents(
    aggregate: AggregateRoot<unknown>,
  ) {
    for (const event of aggregate.domainEvents) {
      await this.dispatch(event);
    }
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));

    this.markedAggregates.splice(index, 1);
  }

  private static findMarkedAggregateByID(
    id: UniqueID,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  public static async dispatchEventsForAggregate(id: UniqueID) {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      await this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap;

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(callback);
  }

  public static clearHandlers() {
    this.handlersMap = {};
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = [];
  }

  private static async dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name;
    const isEventRegistered = eventClassName in this.handlersMap;

    if (!this.shouldRun || !isEventRegistered) return;

    const handlers = this.handlersMap[eventClassName];
    await Promise.all(handlers.map((h) => h(event)));
  }
}
