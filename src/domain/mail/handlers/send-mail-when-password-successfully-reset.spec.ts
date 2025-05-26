import { describe, it, expect, vi } from 'vitest';
import { SendMailWhenPasswordSuccessfullyReset } from './send-mail-when-password-successfully-reset.handler';
import { PasswordSuccessfullyReset } from '@/domain/professional/events/password-successfully-reset.event';
import { FakeMailEntity } from '@/core/entities/mail-fake.entity';

describe('SendMailWhenPasswordSuccessfullyReset', () => {
  it('should send a confirmation email when password is reset', async () => {
    const mail = new FakeMailEntity();
    const sendSpy = vi.spyOn(mail, 'send').mockResolvedValue(undefined);

    const handler = new SendMailWhenPasswordSuccessfullyReset(mail);

    const fakeEvent = new PasswordSuccessfullyReset({
      email: 'maria@example.com',
    });

    await handler.handle(fakeEvent);

    expect(sendSpy).toHaveBeenCalledWith({
      to: 'maria@example.com',
      subject: 'Deovita - Senha redefinida',
      template: 'auth/confirm-recover-password',
    });
  });
});
