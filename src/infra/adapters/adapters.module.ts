import { MailEntity } from '@/core/entities/mail.entity';
import { Module } from '@nestjs/common';
import { NodemailerService } from './mail/nodemailer.service';

@Module({
  providers: [
    {
      provide: MailEntity,
      useClass: NodemailerService,
    },
  ],
  exports: [MailEntity],
})
export class AdaptersModule {}
