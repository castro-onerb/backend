import { Global, Module } from '@nestjs/common';
import { PrismaClinicasService } from './prisma/clinicas/prisma-clinicas.service';
import { PrismaMedicalRepository } from './prisma/clinicas/repositories/medical.repository';

@Global()
@Module({
  providers: [PrismaClinicasService, PrismaMedicalRepository],
  exports: [PrismaClinicasService],
})
export class DatabaseModule {}
