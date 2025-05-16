import { Global, Module } from '@nestjs/common';
import { PrismaClinicasService } from './prisma/clinicas/prisma-clinicas.service';
import { PrismaMedicalRepository } from './prisma/clinicas/repositories/medical.repository';
import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaClinicasService, PrismaService, PrismaMedicalRepository],
  exports: [PrismaClinicasService, PrismaService],
})
export class DatabaseModule {}
