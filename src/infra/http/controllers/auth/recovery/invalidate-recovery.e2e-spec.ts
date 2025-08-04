import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { InvalidateCodeRecoverUseCase } from '@/app/use-cases/auth/invalidate-code-recover.use-case';
import { left, right } from '@/core/either';
import { RecoverPasswordCodeNotFoundError } from '@/app/use-cases/auth/errors';

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

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should invalidate codes and return success message for valid email', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/invalidate-codes')
      .send({ email: validEmail })
      .expect(200);

    expect(response.body).toEqual({
      message: 'Uffa, tudo certo por aqui, todos os códigos foram desativados.',
    });
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/invalidate-codes')
      .send({ email: 'invalid-email' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect((response.body as { statusCode: number }).statusCode).toEqual(400);
  });

  it('should return 401 if use case returns an Error instance', async () => {
    const useCase = app.get(InvalidateCodeRecoverUseCase);
    vi.spyOn(useCase, 'execute').mockResolvedValueOnce(
      left(new RecoverPasswordCodeNotFoundError()),
    );

    const response = await request(app.getHttpServer())
      .post('/auth/invalidate-codes')
      .send({ email: validEmail })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Não conseguimos identificar o código fornecido.',
    });
  });
});
