import { MailEntity } from '@/core/entities/mail.entity';
import { EventHandler } from '@/core/events/event-handler';
import { PasswordRecoveryAttemptFailed } from '@/domain/professional/events/password-recovery-attempt-failed.event';

export class SendMailWhenPasswordRecoveryAttemptFailed
  implements EventHandler<PasswordRecoveryAttemptFailed>
{
  constructor(private readonly mail: MailEntity) {}

  async handle(event: PasswordRecoveryAttemptFailed) {
    await this.mail.send({
      to: event.email,
      subject: 'Deovita - Alerta de Segurança',
      template: 'auth/alert-recover-password',
      context: {
        redirect_url: event.redirectUrl,
      },
    });
  }
}
