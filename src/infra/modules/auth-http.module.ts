import { Module } from '@nestjs/common';
import { TokenController } from '../http/controllers/auth/refresh-token.controller';
import { TokenService } from '@/core/auth/auth.service';
import { RecoverPasswordUseCase } from '@/domain/professional/app/use-cases/recover-password/recover-password.use-case';
import { PrismaService } from '../database/prisma/prisma.service';
import { PrismaRecoveryPasswordRepository } from '../database/prisma/repositories/recovery-password.repository';
import { AdaptersModule } from '@/infra/adapters/adapters.module'; // <- importe aqui
import { PrismaOperatorRepository } from '../database/prisma/clinicas/repositories/operator.repository';
import { RecoveryPasswordController } from '../http/controllers/auth/recovery-password.controller';

@Module({
  imports: [AdaptersModule],
  controllers: [RecoveryPasswordController, TokenController],
  providers: [
    PrismaService,
    TokenService,
    {
      provide: 'IRecoveryPasswordRepository',
      useClass: PrismaRecoveryPasswordRepository,
    },
    {
      provide: 'IOperatorRepository',
      useClass: PrismaOperatorRepository,
    },
    RecoverPasswordUseCase,
  ],
})
export class AuthHttpModule {}
