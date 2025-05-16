import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

import { MailEntity, MailPayload } from '@/core/entities/mail.entity';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../env/env';
import { Injectable } from '@nestjs/common';
import { TemplateService } from '@/templates/template.service';

@Injectable()
export class NodemailerService implements MailEntity {
  private transporter: Transporter;

  constructor(private env: ConfigService<Env, true>) {
    const host = this.env.get('SMTP_HOST', { infer: true });
    const port = this.env.get('SMTP_PORT', { infer: true });
    const user = this.env.get('SMTP_USER', { infer: true });
    const pass = this.env.get('SMTP_PASS', { infer: true });

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: {
        user,
        pass,
      },
    });
  }

  async send(payload: MailPayload) {
    const html = payload.template
      ? TemplateService.compileTemplate(payload.template, payload.context || {})
      : payload.body;

    await this.transporter.sendMail({
      from: payload.from || `Deovita - Saúde Inteligente`,
      to: payload.to,
      subject: payload.subject,
      html,
      cc: payload.cc,
      bcc: payload.bcc,
      attachments: payload.attachments,
    });
  }
}
