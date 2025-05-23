import { Module } from '@nestjs/common';
import { MedicalAuthenticateUseCase } from '@/app/use-cases/authenticate-medical/authenticate-medical.use-case';
import { MedicalAuthenticateController } from '../http/controllers/auth/medical/authenticate-medical.controller';
import { PrismaMedicalRepository } from '../database/prisma/clinicas/repositories/medical.repository';
import { PrismaClinicasService } from '../database/prisma/clinicas/prisma-clinicas.service';
import { Md5Hasher } from '../cryptography/md5-hasher';
import { TokenService } from '@/infra/auth/auth.service';
import { IpLocationService } from '@/core/services/ip-location.service';
import { NodemailerService } from '../adapters/mail/nodemailer.service';

const MEDICAL_REPOSITORY = 'IMedicalRepository';

@Module({
  controllers: [MedicalAuthenticateController],
  providers: [
    IpLocationService,
    MedicalAuthenticateUseCase,
    {
      provide: MEDICAL_REPOSITORY,
      useClass: PrismaMedicalRepository,
    },
    {
      provide: 'Hasher',
      useClass: Md5Hasher,
    },
    {
      provide: 'MailEntity',
      useClass: NodemailerService,
    },
    {
      provide: MEDICAL_REPOSITORY,
      useFactory: (prismaService: PrismaClinicasService) =>
        new PrismaMedicalRepository(prismaService),
      inject: [PrismaClinicasService],
    },
    TokenService,
  ],
})
export class MedicalModule {}
