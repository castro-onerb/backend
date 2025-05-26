import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { TokenService } from '@/infra/auth/auth.service';

describe('TokenController (E2E)', () => {
  let app: INestApplication;

  const mockSub = 'user_mock_id';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TokenService)
      .useValue({
        verifyRefreshToken: vi.fn().mockReturnValue({ sub: mockSub }),
        generateAccessToken: vi.fn().mockReturnValue('mocked-access-token'),
        generateRefreshToken: vi.fn().mockReturnValue('mocked-refresh-token'),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('should return new access and refresh tokens', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .send({ refresh_token: 'valid-refresh-token' })
      .expect(201);

    expect(response.body).toEqual({
      accessToken: 'mocked-access-token',
      refreshToken: 'mocked-refresh-token',
    });

    const rawCookies = response.headers['set-cookie'];
    const cookies = Array.isArray(rawCookies)
      ? rawCookies
      : typeof rawCookies === 'string'
        ? [rawCookies]
        : [];

    expect(
      cookies.some(
        (c: string) => c.startsWith('refresh_token=') && c.includes('Expires='),
      ),
    ).toBe(true);
  });

  it('should return 401 if token is invalid', async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TokenService)
      .useValue({
        verifyRefreshToken: vi.fn(() => {
          throw new Error('Invalid token');
        }),
        generateAccessToken: vi.fn(),
        generateRefreshToken: vi.fn(),
      })
      .compile();

    const localApp = moduleFixture.createNestApplication();
    await localApp.init();

    const response = await request(localApp.getHttpServer())
      .post('/auth/refresh-token')
      .send({ refresh_token: 'invalid-token' })
      .expect(401);

    type ErrorResponse = {
      statusCode: number;
      message: string;
    };

    const body = response.body as ErrorResponse;

    expect(body.statusCode).toBe(401);
    expect(body.message).toBe(
      'Não conseguimos renovar o token de autenticação.',
    );

    await localApp.close();
  });
});
