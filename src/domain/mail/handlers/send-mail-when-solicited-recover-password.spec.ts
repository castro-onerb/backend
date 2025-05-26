import { describe, it, expect, vi } from 'vitest';
import { PasswordRecoveryRequested } from '@/domain/professional/events/password-recovery-requested.event';
import { UniqueID } from '@/core/object-values/unique-id';
import { FakeMailEntity } from '@/core/entities/mail-fake.entity';
import { SendMailWhenPasswordRecoveryRequested } from './send-mail-when-solicited-recover-password.handler';

describe('SendMailWhenPasswordRecoveryRequested', () => {
  it('should send a password recovery email with correct code and name', async () => {
    const mail = new FakeMailEntity();
    const sendSpy = vi.spyOn(mail, 'send').mockResolvedValue(undefined);

    const handler = new SendMailWhenPasswordRecoveryRequested(mail);

    const fakeEvent = new PasswordRecoveryRequested({
      aggregateId: new UniqueID('user-456'),
      email: 'pedro@example.com',
      name: 'Pedro Silva',
      code: 'ABC123',
    });

    await handler.handle(fakeEvent);

    expect(sendSpy).toHaveBeenCalledWith({
      to: 'pedro@example.com',
      subject: 'Deovita - Recuperação de senha',
      template: 'auth/recover-password',
      context: {
        name: 'Pedro Silva',
        code: 'ABC123',
      },
    });
  });
});
