import { MailEntity } from '@/core/entities/mail.entity';
import { EventHandler } from '@/core/events/event-handler';
import { NewAccessAccount } from '@/domain/professional/events/new-access-account.event';

export class SendMailWhenNewAccessAccount
  implements EventHandler<NewAccessAccount>
{
  constructor(private readonly mail: MailEntity) {}

  async handle(event: NewAccessAccount) {
    await this.mail.send({
      to: event.email,
      subject: 'Deovita - Novo acesso detectado',
      template: 'auth/login-detected',
      context: {
        ip: event.ip ?? undefined,
        date: event.ocurredAt.toLocaleString(),
        name: event.name,
      },
    });
  }
}
