import { Global, Module } from '@nestjs/common';
import { PrismaClinicasService } from './prisma/clinicas/prisma-clinicas.service';
import { PrismaMedicalRepository } from './prisma/clinicas/repositories/medical.repository';
import { PrismaService } from './prisma/prisma.service';
import { MedicalRepository } from '@/app/repositories/medical.repository';
import { OperatorRepository } from '@/app/repositories/operator.repository';
import { PrismaOperatorRepository } from './prisma/clinicas/repositories/operator.repository';
import { RecoveryPasswordRepository } from '@/app/repositories/recovery-password.repository';
import { PrismaRecoveryPasswordRepository } from './prisma/repositories/recovery-password.repository';

@Global()
@Module({
  providers: [
    PrismaClinicasService,
    PrismaService,
    {
      provide: MedicalRepository,
      useClass: PrismaMedicalRepository,
    },
    {
      provide: OperatorRepository,
      useClass: PrismaOperatorRepository,
    },
    {
      provide: RecoveryPasswordRepository,
      useClass: PrismaRecoveryPasswordRepository,
    },
  ],
  exports: [
    PrismaClinicasService,
    PrismaService,
    {
      provide: MedicalRepository,
      useClass: PrismaMedicalRepository,
    },
    {
      provide: OperatorRepository,
      useClass: PrismaOperatorRepository,
    },
    {
      provide: RecoveryPasswordRepository,
      useClass: PrismaRecoveryPasswordRepository,
    },
  ],
})
export class DatabaseModule {}
