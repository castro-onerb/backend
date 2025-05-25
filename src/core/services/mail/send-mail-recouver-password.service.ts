import { MailEntity } from '@/core/entities/mail.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendMailRecouverPasswordService {
  constructor(private readonly mail: MailEntity) {}

  async execute(email: string): Promise<void> {
    await this.mail.send({
      to: email,
      template: 'auth/login-detected',
      subject: 'Solicitação de recuperação de senha.',
      context: { name: email },
    });
  }
}
