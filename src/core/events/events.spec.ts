import { SendMailWhenNewAccessAccount } from '@/domain/mail/handlers/send-mail-when-new-access-account.handler';
import { DomainEvents } from './domain-events';
import { NewAccessAccount } from '@/domain/professional/events/new-access-account.event';

describe('Domains Events Dispatch', () => {
  it('should be able register an Domain Event', () => {
    const eventDispatcher = new DomainEvents();
    const eventHandler = new SendMailWhenNewAccessAccount();

    eventDispatcher.register(eventHandler, 'NewAccessAccount');

    expect(eventDispatcher.eventHandlers['NewAccessAccount']).toBeDefined();
    expect(eventDispatcher.eventHandlers['NewAccessAccount'].length).toBe(1);
  });

  it('should be able notify when an event occured', () => {
    const eventDispatcher = new DomainEvents();
    const eventHandler = new SendMailWhenNewAccessAccount();
    eventDispatcher.register(eventHandler, 'NewAccessAccount');

    vi.spyOn(eventHandler, 'handle');

    const event = new NewAccessAccount({
      email: 'breno.castro.ofc@gmail.com',
      date: new Date(),
      localtion: 'Iguatu/CE',
    });

    eventDispatcher.notify(event);

    expect(eventHandler.handle).toHaveBeenCalled();
  });
});
