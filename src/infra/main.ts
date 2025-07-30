import { ExpressAdapter } from '@nestjs/platform-express';
import { Express } from 'express';
import type { RequestHandler } from 'express';
import redoc from 'redoc-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env/env';
import { PrismaInitExceptionFilter } from './database/prisma/clinicas/prisma-filter.service';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerExceptionFilter } from './http/controllers/errors/app.error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const configSwagger = new DocumentBuilder()
    .setTitle('API Prontuário')
    .setDescription(
      'Documentação da API de prontuário do paciente, fornecendo acessos diversos a médicos pacientes, desde atendimentos, agendamentos, fichas médicas, etc.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);

  const httpAdapter = app.getHttpAdapter();

  if (!(httpAdapter instanceof ExpressAdapter)) {
    throw new Error('This app is not using the Express adapter!');
  }

  const expressApp = app.getHttpAdapter().getInstance() as Express;

  expressApp.get(
    '/docs',
    redoc({
      title: 'API Prontuário',
      specUrl: '/swagger-json',
    }),
  ) as RequestHandler;

  expressApp.get('/swagger-json', (_req, res) => {
    res.json(document);
  });

  SwaggerModule.setup('swagger', app, document);

  app.enableCors({
    origin: [
      'http://172.26.16.1:5173',
      'http://192.168.0.6:5173',
      'http://192.168.2.89:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalFilters(new PrismaInitExceptionFilter());
  app.useGlobalFilters(new ThrottlerExceptionFilter());

  const config = app.get<ConfigService<Env, true>>(ConfigService);
  const port = config.get('PORT', { infer: true });
  await app.listen(port, '0.0.0.0');
}
bootstrap();
