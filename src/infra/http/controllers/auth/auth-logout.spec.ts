import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';

describe('AuthLogoutController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('should clear the refresh_token cookie and return a success message', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .expect(200);

    expect(response.body).toEqual({
      message: 'Logout feito com sucesso.',
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
});
