import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env/env';
import { PrismaInitExceptionFilter } from './database/prisma/clinicas/prisma-filter.service';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: ['http://172.26.16.1:5173', 'http://192.168.2.158:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalFilters(new PrismaInitExceptionFilter());

  const config = app.get<ConfigService<Env, true>>(ConfigService);
  const port = config.get('PORT', { infer: true });
  await app.listen(port, '0.0.0.0');
}
bootstrap();
