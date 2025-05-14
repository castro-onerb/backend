import { Module } from '@nestjs/common';
import { OperatorAuthenticateUseCase } from 'src/domain/professional/app/use-cases/authenticate-operator/authenticate-operator.use-case';
import { OperatorAuthenticateController } from '../http/controllers/auth/operator/authenticate-operator.controller';
import { PrismaOperatorRepository } from '../database/prisma/clinicas/repositories/operator.repository';
import { PrismaClinicasService } from '../database/prisma/clinicas/prisma-clinicas.service';
import { Md5Hasher } from '../cryptography/md5-hasher';
import { TokenService } from '@/core/auth/auth.service';

const OPERATOR_REPOSITORY = 'IOperatorRepository';

@Module({
  controllers: [OperatorAuthenticateController],
  providers: [
    OperatorAuthenticateUseCase,
    {
      provide: OPERATOR_REPOSITORY,
      useClass: PrismaOperatorRepository,
    },
    {
      provide: 'Hasher',
      useClass: Md5Hasher,
    },
    {
      provide: OPERATOR_REPOSITORY,
      useFactory: (prismaService: PrismaClinicasService) =>
        new PrismaOperatorRepository(prismaService),
      inject: [PrismaClinicasService],
    },
    TokenService,
  ],
})
export class OperatorModule {}
