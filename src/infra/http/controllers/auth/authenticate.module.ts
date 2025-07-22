import { Module } from '@nestjs/common';
import { TokenController } from './refresh-token.controller';
import { TokenService } from '@/infra/auth/auth.service';
import { RecoverPasswordUseCase } from '@/app/use-cases/auth/recover-password.use-case';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { AdaptersModule } from '@/infra/adapters/adapters.module';
import { RecoveryPasswordController } from './recovery/recover-password.controller';
import { ResetPasswordUseCase } from '@/app/use-cases/auth/reset-password.use-case';
import { ResetPasswordController } from './reset-password.controller';
import { Md5Hasher } from '../../../cryptography/md5-hasher';
import { AuthLogoutController } from './auth-logout.controller';
import { InvalidateCodeRecoverController } from './recovery/invalidate-recovery.controller';
import { InvalidateCodeRecoverUseCase } from '@/app/use-cases/auth/invalidate-code-recover.use-case';
import { DatabaseModule } from '../../../database/database.module';
import { Hasher } from '@/core/cryptography/hasher';
import { AuthProfile } from './auth-profile.controller';
import { MedicalAuthenticateController } from './medical/authenticate-medical.controller';
import { MedicalAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-medical.use-case';
import { OperatorAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-operator.use-case';
import { PatientAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-patient.use-case';
import { Encrypter } from '@/core/cryptography/encrypter';
import { AesEcbCryptographer } from '@/infra/cryptography/aes-ecb-cryptographer';
import { AuthController } from './login/auth-login.controller';

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
    AuthController,
  ],
  providers: [
    PrismaService,
    TokenService,
    MedicalAuthenticateUseCase,
    OperatorAuthenticateUseCase,
    PatientAuthenticateUseCase,
    {
      provide: Hasher,
      useClass: Md5Hasher,
    },
    {
      provide: Encrypter,
      useClass: AesEcbCryptographer,
    },
    RecoverPasswordUseCase,
    ResetPasswordUseCase,
    InvalidateCodeRecoverUseCase,
  ],
})
export class AuthenticateModule {}
