import crypto from 'node:crypto';
import { Encrypter } from '@/core/cryptography/encrypter';
import { ConfigService } from '@nestjs/config';
import { Env } from '../env/env';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AesEcbCryptographer implements Encrypter {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  encrypt(value: string): string {
    const secret_key_full = this.configService.get(
      'CLINICAS_DECRYPT_SECRET_KEYS',
      { infer: true },
    );
    const secret_key = Buffer.from(secret_key_full.slice(0, 16), 'utf8');
    const cipher = crypto.createCipheriv('aes-128-ecb', secret_key, null);
    cipher.setAutoPadding(true);

    const encrypted = Buffer.concat([
      cipher.update(Buffer.from(value, 'utf8')),
      cipher.final(),
    ]);

    return encrypted.toString('base64');
  }

  decrypt(value: string): string {
    const secret_key_full = this.configService.get(
      'CLINICAS_DECRYPT_SECRET_KEYS',
      {
        infer: true,
      },
    );

    const secret_key = Buffer.from(secret_key_full.slice(0, 16), 'utf8');
    const encryptedData = Buffer.from(value, 'base64');

    const decipher = crypto.createDecipheriv('aes-128-ecb', secret_key, null);
    decipher.setAutoPadding(true);

    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}
