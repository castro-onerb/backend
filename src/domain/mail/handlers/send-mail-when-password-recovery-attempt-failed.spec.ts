import { describe, it, expect, vi } from 'vitest';
import { SendMailWhenPasswordRecoveryAttemptFailed } from './send-mail-when-password-recovery-attempt-failed.handler';
import { PasswordRecoveryAttemptFailed } from '@/domain/professional/events/password-recovery-attempt-failed.event';
import { FakeMailEntity } from '@/core/entities/mail-fake.entity';

describe('SendMailWhenPasswordRecoveryAttemptFailed', () => {
  it('should send a security alert email with the correct data', async () => {
    const mail = new FakeMailEntity();
    const sendSpy = vi.spyOn(mail, 'send').mockResolvedValue(undefined);

    const handler = new SendMailWhenPasswordRecoveryAttemptFailed(mail);

    const fakeEvent = new PasswordRecoveryAttemptFailed({
      email: 'jane@example.com',
      redirectUrl: 'https://app.deovita.com.br/recuperar',
    });

    await handler.handle(fakeEvent);

    expect(sendSpy).toHaveBeenCalledWith({
      to: 'jane@example.com',
      subject: 'Deovita - Alerta de Segurança',
      template: 'auth/alert-recover-password',
      context: {
        redirect_url: 'https://app.deovita.com.br/recuperar',
      },
    });
  });
});
