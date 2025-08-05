import { MailEntity } from '@/core/entities/mail.entity';
import { EventHandler } from '@/core/events/event-handler';
import { NewAccessAccount } from '@/domain/professional/events/new-access-account.event';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/infra/env/env';

export class SendMailWhenNewAccessAccount
  implements EventHandler<NewAccessAccount>
{
  constructor(
    private readonly mail: MailEntity,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async handle(event: NewAccessAccount) {
    const frontendUrl = this.config.get('FRONTEND_URL', { infer: true });
    const invalidateUrl = `${frontendUrl}/auth/sessions/${event.sessionId}/invalidate`;
    await this.mail.send({
      to: event.email,
      subject: 'Deovita - Novo acesso detectado',
      template: 'auth/login-detected',
      context: {
        ip: event.ip ?? undefined,
        date: event.ocurredAt.toLocaleString(),
        name: event.name,
        invalidateUrl,
      },
    });
  }
}
