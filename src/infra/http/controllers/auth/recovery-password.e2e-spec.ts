import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { RecoverPasswordUseCase } from '@/app/use-cases/auth/recover-password.use-case';

describe('RecoveryPasswordController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RecoverPasswordUseCase)
      .useValue({
        execute: vi.fn().mockResolvedValue({
          isLeft: () => false,
          isRight: () => true,
          value: undefined,
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('should send recovery code and return success message', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/recover-password')
      .send({ email: 'john.doe@example.com' })
      .expect(201);

    expect(response.body).toEqual({
      success: true,
      message: 'Código de recuperação enviado para o email informado.',
    });
  });

  it('should return 400 if request body is invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/recover-password')
      .send({ email: 'not-an-email' })
      .expect(400);

    type ErrorResponse = {
      statusCode: number;
      message: string | string[];
      error?: string;
    };

    const body = response.body as ErrorResponse;
    expect(body.statusCode).toBe(400);
  });

  it('should return 401 if use case returns unauthorized error', async () => {
    const mockExecute = vi.fn().mockResolvedValue({
      isLeft: () => true,
      isRight: () => false,
      value: new Error('Usuário não autorizado'),
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RecoverPasswordUseCase)
      .useValue({ execute: mockExecute })
      .compile();

    const localApp = moduleFixture.createNestApplication();
    await localApp.init();

    const response = await request(localApp.getHttpServer())
      .post('/auth/recover-password')
      .send({ email: 'unauthorized@example.com' })
      .expect(401);

    const body = response.body as { statusCode: number; message: string };
    expect(body.message).toBe('Usuário não autorizado');

    expect(body.message).toBe('Usuário não autorizado');
    await localApp.close();
  });
});
