import { MailEntity } from '@/core/entities/mail.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendMailRecouverPasswordService {
  constructor(private readonly mail: MailEntity) {}

  async execute(email: string): Promise<void> {
    await this.mail.send({
      to: email,
      subject: 'Solicitação de recuperação de senha.',
      body: '<h1>Olá e bem-vindo à nossa plataforma!</h1>',
    });
  }
}
