// services/login-detector.service.ts

import { Injectable } from '@nestjs/common';
import { IpLocationService } from './ip-location.service';
import { MailEntity } from '@/core/entities/mail.entity';

@Injectable()
export class LoginDetectorService {
  constructor(
    private readonly ipLocation: IpLocationService,
    private readonly mail: MailEntity,
  ) {}

  async notifyLogin(email: string, name: string, ip?: string) {
    if (!ip) return;

    try {
      const location = await this.ipLocation.lookup(ip);
      await this.mail.send({
        to: email,
        subject: 'Deovita - Alerta de segurança',
        template: 'auth/login-detected',
        context: {
          name,
          ip: location.ip,
          city: location.city,
          region: location.region,
          country: location.country,
        },
      });
    } catch (err) {
      console.error(
        '[LoginDetectorService] Falha ao enviar e-mail de aviso de login:',
        err,
      );
    }
  }
}
