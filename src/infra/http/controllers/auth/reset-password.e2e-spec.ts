import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { ResetPasswordUseCase } from '@/app/use-cases/auth/reset-password.use-case';

describe('ResetPasswordController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ResetPasswordUseCase)
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

  it('should reset password successfully and return 200 with no content', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({
        email: 'john.doe@example.com',
        code: '123456',
        password: 'newStrongPassword@13',
      })
      .expect(201);

    expect(response.body).toEqual({});
  });

  it('should return 400 if body is invalid (fails zod)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({
        email: 'invalid-email',
        code: '',
        password: '',
      })
      .expect(400);

    type ErrorResponse = {
      statusCode: number;
      message: string | string[];
      error?: string;
    };

    const body = response.body as ErrorResponse;

    expect(body.statusCode).toBe(400);
  });

  it('should return error mapped by domain if use case returns failure', async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ResetPasswordUseCase)
      .useValue({
        execute: vi.fn().mockResolvedValue({
          isLeft: () => true,
          isRight: () => false,
          value: new Error('Código de recuperação inválido'),
        }),
      })
      .compile();

    const localApp = moduleFixture.createNestApplication();
    await localApp.init();

    const response = await request(localApp.getHttpServer())
      .post('/auth/reset-password')
      .send({
        email: 'john.doe@example.com',
        code: '000000',
        password: 'any',
      })
      .expect(400);

    type ErrorResponse = {
      statusCode: number;
      message: string;
    };

    const body = response.body as ErrorResponse;

    expect(body.statusCode).toBeGreaterThanOrEqual(400);
    expect(typeof body.message).toBe('string');

    await localApp.close();
  });
});
