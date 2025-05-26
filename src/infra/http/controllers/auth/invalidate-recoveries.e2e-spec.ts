import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { InvalidateCodeRecoverUseCase } from '@/app/use-cases/auth/invalidate-code-recover.use-case';
import { left, right } from '@/core/either';
import { AppError } from '@/core/errors/app-error';

class FakeRecoverError extends AppError {
  constructor() {
    super('Código inválido', { code: 'recover.fake_error' });
  }
}

describe('InvalidateCodeRecoverController (E2E)', () => {
  let app: INestApplication;

  const validEmail = 'john@example.com';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(InvalidateCodeRecoverUseCase)
      .useValue({
        execute: vi.fn().mockResolvedValue(right({ success: true })),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should invalidate codes and return success message for valid email', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/invalidate-codes')
      .query({ email: validEmail })
      .expect(200);

    expect(response.body).toEqual({
      message: 'Uffa, tudo certo por aqui, todos os códigos foram desativados.',
    });
  });

  it('should return 400 for invalid email query param', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/invalidate-codes')
      .query({ email: 'invalid-email' })
      .expect(400);

    type ErrorResponse = { statusCode: number; message: string[] };

    const body = response.body as ErrorResponse;

    expect(response.body).toHaveProperty('message');
    expect(body.statusCode).toEqual(400);
  });

  it('should return 401 if use case returns Error instance', async () => {
    const useCase = app.get(InvalidateCodeRecoverUseCase);
    vi.spyOn(useCase, 'execute').mockResolvedValueOnce(
      left(new FakeRecoverError()),
    );

    const response = await request(app.getHttpServer())
      .get('/auth/invalidate-codes')
      .query({ email: validEmail })
      .expect(401);

    expect(response.body).toEqual({
      statusCode: 401,
      message: 'Código inválido',
    });
  });
});
