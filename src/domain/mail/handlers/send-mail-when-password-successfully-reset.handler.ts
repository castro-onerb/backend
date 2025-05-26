import { MailEntity } from '@/core/entities/mail.entity';
import { EventHandler } from '@/core/events/event-handler';
import { PasswordSuccessfullyReset } from '@/domain/professional/events/password-successfully-reset.event';

export class SendMailWhenPasswordSuccessfullyReset
  implements EventHandler<PasswordSuccessfullyReset>
{
  constructor(private mail: MailEntity) {}

  async handle(event: PasswordSuccessfullyReset) {
    await this.mail.send({
      to: event.email,
      subject: 'Deovita - Senha redefinida',
      template: 'auth/confirm-recover-password',
    });
  }
}
