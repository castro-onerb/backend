import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { TokenService } from '@/infra/auth/auth.service';
import { IpLocationService } from '@/core/services/ip-location.service';
import { IpLocation } from '@/core/object-values/ip-location';
import { MedicalAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-medical.use-case';

describe('MedicalAuthenticateController (E2E)', () => {
  let app: INestApplication;

  const mockMedical = {
    id: 'medical_mock_id',
    email: 'doctor@example.com',
    crm: '123456-UF',
    name: 'Dr. Mock',
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
      .overrideProvider(IpLocationService)
      .useValue({
        lookup: vi.fn().mockResolvedValue(
          new IpLocation({
            country: '',
            region: '',
            regionName: '',
            city: '',
            lat: 0,
            lon: 0,
            ip: '',
          }),
        ),
      })
      .overrideProvider('MailEntity')
      .useValue({ send: vi.fn().mockResolvedValue(undefined) })
      .overrideProvider(MedicalAuthenticateUseCase)
      .useValue({
        execute: vi.fn().mockResolvedValue({
          isLeft: () => false,
          isRight: () => true,
          value: { medical: mockMedical },
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('should authenticate and return tokens + user info', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login/medical')
      .send({ crm: '123456-UF', password: 'password' })
      .expect(201);

    expect(response.body).toEqual({
      access_token: 'mocked-access-token',
    });

    const rawCookies = response.headers['set-cookie'];
    const cookies = Array.isArray(rawCookies)
      ? rawCookies
      : typeof rawCookies === 'string'
        ? [rawCookies]
        : ([] as string[]);

    expect(cookies.length).toBeGreaterThan(0);
    expect(cookies.some((c: string) => c.startsWith('refresh_token='))).toBe(
      true,
    );
  });

  it('should return 400 when request body is invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login/medical')
      .send({ crm: '', password: '' })
      .expect(400);

    type ZodHttpError = {
      statusCode: number;
      message: string;
      errors: {
        name: string;
        details: { path: string[]; message: string }[];
      };
    };

    const body = response.body as ZodHttpError;

    expect(body.statusCode).toBe(400);
  });
});
