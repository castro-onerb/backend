import { Module } from '@nestjs/common';
import { MedicalAuthenticateUseCase } from 'src/domain/professional/app/use-cases/authenticate-medical/authenticate-medical.use-case';
import { MedicalAuthenticateController } from '../http/controllers/auth/medical/authenticate-medical.controller';
import { PrismaMedicalRepository } from '../database/prisma/clinicas/repositories/medical.repository';
import { PrismaClinicasService } from '../database/prisma/clinicas/prisma-clinicas.service';
import { Md5Hasher } from '../cryptography/md5-hasher';

const MEDICAL_REPOSITORY = 'IMedicalRepository';

@Module({
  controllers: [MedicalAuthenticateController],
  providers: [
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
      provide: MEDICAL_REPOSITORY,
      useFactory: (prismaService: PrismaClinicasService) =>
        new PrismaMedicalRepository(prismaService),
      inject: [PrismaClinicasService],
    },
  ],
})
export class MedicalModule {}
