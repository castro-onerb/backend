import { Module } from '@nestjs/common';
import { TokenController } from './refresh-token.controller';
import { TokenService } from '@/infra/auth/auth.service';
import { RecoverPasswordUseCase } from '@/app/use-cases/auth/recover-password.use-case';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { AdaptersModule } from '@/infra/adapters/adapters.module';
import { RecoveryPasswordController } from './recover-password.controller';
import { ResetPasswordUseCase } from '@/app/use-cases/auth/reset-password.use-case';
import { ResetPasswordController } from './reset-password.controller';
import { Md5Hasher } from '../../../cryptography/md5-hasher';
import { AuthLogoutController } from './authenticate-logout.controller';
import { InvalidateCodeRecoverController } from './invalidate-recoveries.controller';
import { InvalidateCodeRecoverUseCase } from '@/app/use-cases/auth/invalidate-code-recover.use-case';
import { DatabaseModule } from '../../../database/database.module';
import { Hasher } from '@/core/cryptography/hasher';
import { AuthProfile } from './auth-profile.controller';
import { MedicalAuthenticateController } from './medical/authenticate-medical.controller';
import { MedicalAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-medical.use-case';
import { OperatorAuthenticateController } from './operator/authenticate-operator.controller';
import { OperatorAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-operator.use-case';

@Module({
  imports: [AdaptersModule, DatabaseModule],
  controllers: [
    RecoveryPasswordController,
    ResetPasswordController,
    TokenController,
    AuthLogoutController,
    InvalidateCodeRecoverController,
    AuthProfile,
    MedicalAuthenticateController,
    OperatorAuthenticateController,
  ],
  providers: [
    PrismaService,
    TokenService,
    MedicalAuthenticateUseCase,
    OperatorAuthenticateUseCase,
    {
      provide: Hasher,
      useClass: Md5Hasher,
    },
    RecoverPasswordUseCase,
    ResetPasswordUseCase,
    InvalidateCodeRecoverUseCase,
  ],
})
export class AuthenticateModule {}
