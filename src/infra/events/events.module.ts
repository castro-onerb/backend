import { MailEntity } from '@/core/entities/mail.entity';
import { DomainEvents } from '@/core/events/domain-events';
import { SendMailWhenNewAccessAccount } from '@/domain/mail/handlers/send-mail-when-new-access-account.handler';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { NodemailerService } from '../adapters/mail/nodemailer.service';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/infra/env/env';
import { SendMailWhenPasswordRecoveryRequested } from '@/domain/mail/handlers/send-mail-when-solicited-recover-password.handler';
import { SendMailWhenPasswordRecoveryAttemptFailed } from '@/domain/mail/handlers/send-mail-when-password-recovery-attempt-failed.handler';
import { SendMailWhenPasswordSuccessfullyReset } from '@/domain/mail/handlers/send-mail-when-password-successfully-reset.handler';

@Module({
  providers: [
    {
      provide: 'MailEntity',
      useClass: NodemailerService,
    },
  ],
})
export class EventsModule implements OnModuleInit {
  constructor(
    @Inject('MailEntity') private readonly mail: MailEntity,
    private readonly config: ConfigService<Env, true>,
  ) {}

  onModuleInit() {
    DomainEvents.register(
      'NewAccessAccount',
      new SendMailWhenNewAccessAccount(this.mail, this.config),
    );
    DomainEvents.register(
      'PasswordRecoveryRequested',
      new SendMailWhenPasswordRecoveryRequested(this.mail, this.config),
    );
    DomainEvents.register(
      'PasswordRecoveryAttemptFailed',
      new SendMailWhenPasswordRecoveryAttemptFailed(this.mail),
    );
    DomainEvents.register(
      'PasswordSuccessfullyReset',
      new SendMailWhenPasswordSuccessfullyReset(this.mail),
    );
  }
}
