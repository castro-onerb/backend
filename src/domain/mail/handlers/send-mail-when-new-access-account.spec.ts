import { describe, it, expect, vi } from 'vitest';
import { SendMailWhenNewAccessAccount } from './send-mail-when-new-access-account.handler';
import { NewAccessAccount } from '@/domain/professional/events/new-access-account.event';
import { UniqueID } from '@/core/object-values/unique-id';
import { FakeMailEntity } from '@/core/entities/mail-fake.entity';
import { ConfigService } from '@nestjs/config';

describe('SendMailWhenNewAccessAccount', () => {
  it('should send an email with the correct data', async () => {
    const mail = new FakeMailEntity();
    const sendSpy = vi.spyOn(mail, 'send').mockResolvedValue(undefined);

    const config = {
      get: vi.fn().mockReturnValue('http://localhost:3333'),
    } as unknown as ConfigService;
    const handler = new SendMailWhenNewAccessAccount(mail, config as any);

    const fakeEvent = new NewAccessAccount({
      aggregateId: new UniqueID('user-123'),
      email: 'john@example.com',
      name: 'John Doe',
      ip: '192.168.0.1',
      sessionId: 'session-123',
    });

    await handler.handle(fakeEvent);

    expect(sendSpy).toHaveBeenCalledWith({
      to: 'john@example.com',
      subject: 'Deovita - Novo acesso detectado',
      template: 'auth/login-detected',
      context: {
        ip: '192.168.0.1',
        date: fakeEvent.ocurredAt.toLocaleString(),
        name: 'John Doe',
        invalidateUrl:
          'http://localhost:3333/auth/sessions/session-123/invalidate',
      },
    });
  });
});
