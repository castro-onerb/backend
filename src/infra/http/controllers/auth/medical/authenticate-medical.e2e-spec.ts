import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MedicalAuthenticateUseCase } from '@/domain/professional/app/use-cases/authenticate-medical/authenticate-medical.use-case';
import { TokenService } from '@/core/auth/auth.service';
import { IpLocationService } from '@/core/services/ip-location.service';
import { IpLocation } from '@/core/object-values/ip-location';
import { AppModule } from '@/app.module';

describe('MedicalAuthenticateController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockTokenService = {
      generateAccessToken: vi.fn().mockReturnValue('mocked-access-token'),
      generateRefreshToken: vi.fn().mockReturnValue('mocked-refresh-token'),
    };

    const mockIpLocationService = {
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
    };

    const mockNodemailerService = {
      send: vi.fn().mockResolvedValue(undefined),
    };

    const mockAuthenticateUseCase = {
      execute: vi.fn().mockResolvedValue({
        isLeft: () => false,
        isRight: () => true,
        value: {
          medical: {
            id: 'medical_mock_id',
            email: 'doctor@example.com',
            crm: '123456-UF',
            name: 'Dr. Mock',
          },
        },
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TokenService)
      .useValue(mockTokenService)
      .overrideProvider(IpLocationService)
      .useValue(mockIpLocationService)
      .overrideProvider('MailEntity') // pode ser o token do provider
      .useValue(mockNodemailerService)
      .overrideProvider(MedicalAuthenticateUseCase)
      .useValue(mockAuthenticateUseCase)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /auth/medical - should authenticate and return tokens', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/medical')
      .send({ crm: '123456-UF', password: 'password' })
      .expect(201);

    expect(response.body).toEqual({
      access_token: 'mocked-access-token',
      refresh_token: 'mocked-refresh-token',
    });

    const rawCookies = response.headers['set-cookie'];
    const cookies = Array.isArray(rawCookies)
      ? rawCookies
      : typeof rawCookies === 'string'
        ? [rawCookies]
        : ([] as string[]);

    expect(cookies).toBeDefined();
    expect(cookies.some((c: string) => c.startsWith('refresh_token='))).toBe(
      true,
    );
  });

  it('POST /auth/medical - should fail validation if body is invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/medical')
      .send({ crm: '', password: '' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });
});
