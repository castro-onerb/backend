import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { TokenService } from '@/infra/auth/auth.service';
import { OperatorAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-operator.use-case';
import { MailEntity } from '@/core/entities/mail.entity';

describe('OperatorAuthenticateController (E2E)', () => {
  let app: INestApplication;

  const mockOperator = {
    id: 'operator_mock_id',
    email: 'operator@example.com',
    username: 'mockoperator',
    name: 'Operator Mock',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TokenService)
      .useValue({
        generateAccessToken: vi.fn().mockReturnValue('mocked-access-token'),
        generateRefreshToken: vi.fn().mockReturnValue('mocked-refresh-token'),
      })
      .overrideProvider('MailEntity')
      .useValue({
        send: vi.fn().mockResolvedValue(undefined),
      } satisfies MailEntity)
      .overrideProvider(OperatorAuthenticateUseCase)
      .useValue({
        execute: vi.fn().mockResolvedValue({
          isLeft: () => false,
          isRight: () => true,
          value: { operator: mockOperator },
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('should authenticate and return only access_token with refresh_token in httpOnly cookie', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login/operator')
      .send({ username: 'mockoperator', password: 'secret123' })
      .expect(201);

    expect(response.body).toEqual({
      access_token: 'mocked-access-token',
    });

    const rawCookies = response.headers['set-cookie'];
    const cookies = Array.isArray(rawCookies)
      ? rawCookies
      : typeof rawCookies === 'string'
        ? [rawCookies]
        : [];

    expect(cookies.some((c: string) => c.startsWith('refresh_token='))).toBe(
      true,
    );
  });

  it('should return 400 when body is invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login/operator')
      .send({})
      .expect(400);

    type ErrorResponse = {
      statusCode: number;
      message: string[];
      error: string;
    };

    const body = response.body as ErrorResponse;

    expect(body.statusCode).toBe(400);
  });
});
