import { MailEntity } from '@/core/entities/mail.entity';
import { DomainEvents } from '@/core/events/domain-events';
import { SendMailWhenNewAccessAccount } from '@/domain/mail/handlers/send-mail-when-new-access-account.handler';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { NodemailerService } from '../adapters/mail/nodemailer.service';

@Module({
  providers: [
    {
      provide: 'MailEntity',
      useClass: NodemailerService,
    },
  ],
})
export class EventsModule implements OnModuleInit {
  constructor(@Inject('MailEntity') private readonly mail: MailEntity) {}

  onModuleInit() {
    DomainEvents.register(
      'NewAccessAccount',
      new SendMailWhenNewAccessAccount(this.mail),
    );
  }
}
