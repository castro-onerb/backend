import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NodemailerService } from './nodemailer.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import type { Transporter } from 'nodemailer';
import { TemplateService } from '@/templates/template.service';
import type { Env } from '@/infra/env/env';

vi.mock('nodemailer', async () => {
  const actual =
    await vi.importActual<typeof import('nodemailer')>('nodemailer');
  return {
    ...actual,
    createTransport: vi.fn(),
  };
});

const sendMailMock = vi.fn();

const mockTransporter = {
  sendMail: sendMailMock,
} as unknown as Transporter<nodemailer.SentMessageInfo>;

const mockedNodemailer = vi.mocked(nodemailer); // tipado corretamente
mockedNodemailer.createTransport.mockReturnValue(mockTransporter);

describe('NodemailerService', () => {
  let service: NodemailerService;

  const configMock = {
    get: vi.fn((key: keyof Env) => {
      const values: Record<string, string | number> = {
        SMTP_HOST: 'smtp.example.com',
        SMTP_PORT: 587,
        SMTP_USER: 'user',
        SMTP_PASS: 'pass',
        DATABASE_URL: '',
        DATABASE_CLINICAS_URL: '',
        FRONTEND_URL: '',
        PORT: 3000,
        JWT_SECRET_KEY: '',
        JWT_PUBLIC_KEY: '',
      };

      return values[key];
    }),
  } as unknown as ConfigService<Env, true>;

  beforeEach(() => {
    sendMailMock.mockClear();
    service = new NodemailerService(configMock);
  });

  it('should send an email using template', async () => {
    const compileSpy = vi
      .spyOn(TemplateService, 'compileTemplate')
      .mockReturnValue('<p>Hello</p>');

    await service.send({
      to: 'john@example.com',
      subject: 'Test Subject',
      template: 'auth/test-template',
      context: { name: 'John' },
    });

    expect(compileSpy).toHaveBeenCalledWith('auth/test-template', {
      name: 'John',
    });
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'john@example.com',
        subject: 'Test Subject',
        html: '<p>Hello</p>',
      }),
    );
  });

  it('should send an email using raw body if no template is provided', async () => {
    await service.send({
      to: 'jane@example.com',
      subject: 'No Template',
      body: '<p>Raw body</p>',
    });

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'jane@example.com',
        subject: 'No Template',
        html: '<p>Raw body</p>',
      }),
    );
  });
});
