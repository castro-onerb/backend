import { MailEntity } from '@/core/entities/mail.entity';
import { EventHandler } from '@/core/events/event-handler';
import { PasswordRecoveryRequested } from '@/domain/professional/events/password-recovery-requested.event';

export class SendMailWhenPasswordRecoveryRequested
  implements EventHandler<PasswordRecoveryRequested>
{
  constructor(private readonly mail: MailEntity) {}

  async handle(event: PasswordRecoveryRequested) {
    await this.mail.send({
      to: event.email,
      subject: 'Deovita - Recuperação de senha',
      template: 'auth/recover-password',
      context: {
        name: event.name,
        code: event.code,
      },
    });
  }
}
