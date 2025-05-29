import { Module } from '@nestjs/common';
import { TokenController } from '../http/controllers/auth/refresh-token.controller';
import { TokenService } from '@/infra/auth/auth.service';
import { RecoverPasswordUseCase } from '@/app/use-cases/auth/recover-password.use-case';
import { PrismaService } from '../database/prisma/prisma.service';
import { AdaptersModule } from '@/infra/adapters/adapters.module';
import { RecoveryPasswordController } from '../http/controllers/auth/recover-password.controller';
import { ResetPasswordUseCase } from '@/app/use-cases/auth/reset-password.use-case';
import { ResetPasswordController } from '../http/controllers/auth/reset-password.controller';
import { Md5Hasher } from '../cryptography/md5-hasher';
import { AuthLogoutController } from '../http/controllers/auth/authenticate-logout.controller';
import { InvalidateCodeRecoverController } from '../http/controllers/auth/invalidate-recoveries.controller';
import { InvalidateCodeRecoverUseCase } from '@/app/use-cases/auth/invalidate-code-recover.use-case';
import { DatabaseModule } from '../database/database.module';
import { Hasher } from '@/core/cryptography/hasher';
import { AuthProfile } from '../http/controllers/auth/auth-profile.controller';

@Module({
  imports: [AdaptersModule, DatabaseModule],
  controllers: [
    RecoveryPasswordController,
    ResetPasswordController,
    TokenController,
    AuthLogoutController,
    InvalidateCodeRecoverController,
    AuthProfile,
  ],
  providers: [
    PrismaService,
    TokenService,
    {
      provide: Hasher,
      useClass: Md5Hasher,
    },
    RecoverPasswordUseCase,
    ResetPasswordUseCase,
    InvalidateCodeRecoverUseCase,
  ],
})
export class AuthHttpModule {}
