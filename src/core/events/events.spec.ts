import { DomainEvents } from './domain-events';
import { NewAccessAccount } from '@/domain/professional/events/new-access-account.event';
import { EventHandler } from './event-handler';
import { UniqueID } from '../object-values/unique-id';

describe('DomainEvents', () => {
  afterEach(() => {
    DomainEvents['handlersMap'] = {};
  });

  it('should register a handler for an event', () => {
    const handler: EventHandler = {
      handle: vi.fn(),
    };

    DomainEvents.register('NewAccessAccount', handler);

    const handlers = DomainEvents['handlersMap']['NewAccessAccount'];
    expect(handlers).toBeDefined();
    expect(handlers).toContain(handler);
  });

  it('should dispatch a registered event to the handler', async () => {
    const handleMock = vi.fn().mockResolvedValue(undefined);

    const handler: EventHandler = {
      handle: handleMock,
    };

    DomainEvents.register('NewAccessAccount', handler);

    const event = new NewAccessAccount({
      aggregateId: new UniqueID(),
      email: 'breno@example.com',
      name: 'Breno Castro',
      sessionId: 'session-1',
    });

    DomainEvents.dispatch(event);

    // aguarda o setTimeout interno rodar
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(handleMock).toHaveBeenCalledWith(event);
  });
});
