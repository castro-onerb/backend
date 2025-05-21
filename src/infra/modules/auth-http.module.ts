import { Module } from '@nestjs/common';
import { TokenController } from '../http/controllers/auth/refresh-token.controller';
import { TokenService } from '@/core/auth/auth.service';
import { RecoverPasswordUseCase } from '@/domain/professional/app/use-cases/recover-password/recover-password.use-case';
import { PrismaService } from '../database/prisma/prisma.service';
import { PrismaRecoveryPasswordRepository } from '../database/prisma/repositories/recovery-password.repository';
import { AdaptersModule } from '@/infra/adapters/adapters.module';
import { PrismaOperatorRepository } from '../database/prisma/clinicas/repositories/operator.repository';
import { RecoveryPasswordController } from '../http/controllers/auth/recovery-password.controller';
import { ResetPasswordUseCase } from '@/domain/professional/app/use-cases/reset-password/reset-password.use-case';
import { ResetPasswordController } from '../http/controllers/auth/reset-password.controller';
import { Md5Hasher } from '../cryptography/md5-hasher';
import { AuthLogoutController } from '../http/controllers/auth/authenticate-logout.controller';
import { InvalidateCodeRecoverController } from '../http/controllers/auth/invalidate-recoveries.controller';
import { InvalidateCodeRecoverUseCase } from '@/domain/professional/app/use-cases/invalidate-code-recover/invalidate-code-recover.use-case';
import { CloseSessionUseCase } from '@/domain/professional/app/use-cases/sessions/close-session/close-session.use-case';
import { PrismaActiveSessionsRepository } from '../database/prisma/repositories/active-sessions.repository';

@Module({
  imports: [AdaptersModule],
  controllers: [
    RecoveryPasswordController,
    ResetPasswordController,
    TokenController,
    AuthLogoutController,
    InvalidateCodeRecoverController,
  ],
  providers: [
    PrismaService,
    TokenService,
    {
      provide: 'IRecoveryPasswordRepository',
      useClass: PrismaRecoveryPasswordRepository,
    },
    {
      provide: 'Hasher',
      useClass: Md5Hasher,
    },
    {
      provide: 'IActiveSessionsRepository',
      useClass: PrismaActiveSessionsRepository,
    },
    {
      provide: 'IOperatorRepository',
      useClass: PrismaOperatorRepository,
    },
    RecoverPasswordUseCase,
    ResetPasswordUseCase,
    InvalidateCodeRecoverUseCase,
    CloseSessionUseCase,
  ],
})
export class AuthHttpModule {}
