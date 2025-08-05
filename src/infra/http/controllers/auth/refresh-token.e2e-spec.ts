import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { TokenService } from '@/infra/auth/auth.service';
import { ActiveSessionRepository } from '@/app/repositories/active-session.repository';
import cookieParser from 'cookie-parser';

describe('TokenController (E2E)', () => {
  let app: INestApplication;

  const mockSub = 'user_mock_id';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TokenService)
      .useValue({
        verifyRefreshToken: vi.fn().mockReturnValue({
          sub: mockSub,
          name: 'Test User',
          role: 'operator',
        }),
        generateAccessToken: vi.fn().mockReturnValue('mocked-access-token'),
        generateRefreshToken: vi.fn().mockReturnValue('mocked-refresh-token'),
      })
      .overrideProvider(ActiveSessionRepository)
      .useValue({
        findByToken: vi.fn().mockResolvedValue({
          id: 'session-1',
          userId: mockSub,
          token: 'valid-refresh-token',
          isActive: true,
        }),
        updateToken: vi.fn(),
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

    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('should return new access and refresh tokens', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me/refresh-token')
      .set('Cookie', [`refresh_token=valid-refresh-token`])
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
      .overrideProvider(ActiveSessionRepository)
      .useValue({ findByToken: vi.fn(), updateToken: vi.fn() })
      .compile();

    const localApp = moduleFixture.createNestApplication();
    await localApp.init();

    const response = await request(localApp.getHttpServer())
      .post('/auth/me/refresh-token')
      .set('Cookie', [`refresh_token=invalid-token`])
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
