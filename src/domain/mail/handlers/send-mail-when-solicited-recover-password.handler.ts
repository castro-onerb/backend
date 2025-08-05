import { MailEntity } from '@/core/entities/mail.entity';
import { EventHandler } from '@/core/events/event-handler';
import { PasswordRecoveryRequested } from '@/domain/professional/events/password-recovery-requested.event';
import { Env } from '@/infra/env/env';
import { ConfigService } from '@nestjs/config';

export class SendMailWhenPasswordRecoveryRequested
  implements EventHandler<PasswordRecoveryRequested>
{
  constructor(
    private readonly mail: MailEntity,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async handle(event: PasswordRecoveryRequested) {
    const frontendUrl = this.config.get('FRONTEND_URL', { infer: true });
    const autofill = `${frontendUrl}/recover?email=${event.email}&code=${event.code}`;
    const invalidate = `${frontendUrl}/recover/invalidate?email=${event.email}`;
    await this.mail.send({
      to: event.email,
      subject: 'Deovita - Recuperação de senha',
      template: 'auth/recover-password',
      context: {
        name: event.name,
        code: event.code,
        autofill,
        invalidate,
      },
    });
  }
}
