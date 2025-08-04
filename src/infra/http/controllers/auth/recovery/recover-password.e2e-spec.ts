import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { RecoverPasswordUseCase } from '@/app/use-cases/auth/recover-password.use-case';
import {
  RecoverPasswordEmailNotFoundError,
  RecoverPasswordMultipleUsersError,
  RecoverPasswordUnauthorizedError,
} from '@/app/use-cases/auth/errors';

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
      value: new RecoverPasswordUnauthorizedError(),
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
    expect(body.message).toBe(
      'Não conseguimos autorização para realizar esta ação.',
    );

    expect(body.message).toBe(
      'Não conseguimos autorização para realizar esta ação.',
    );
    await localApp.close();
  });

  it('should return 409 if multiple users found with same email', async () => {
    const mockExecute = vi.fn().mockResolvedValue({
      isLeft: () => true,
      isRight: () => false,
      value: new RecoverPasswordMultipleUsersError(),
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
      .send({ email: 'duplicado@example.com' })
      .expect(409);

    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Encontramos mais de um operador com esse email vinculado.',
      error: 'Conflict',
    });

    await localApp.close();
  });

  it('should return 404 if email is not found', async () => {
    const mockExecute = vi.fn().mockResolvedValue({
      isLeft: () => true,
      isRight: () => false,
      value: new RecoverPasswordEmailNotFoundError(),
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
      .send({ email: 'naoexiste@example.com' })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Não encontramos acesso a esse email.',
      error: 'Not Found',
    });

    await localApp.close();
  });
});
