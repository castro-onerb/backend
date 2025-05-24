import { Module } from '@nestjs/common';
import { MedicalAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-medical.use-case';
import { MedicalAuthenticateController } from '../http/controllers/auth/medical/authenticate-medical.controller';
import { Md5Hasher } from '../cryptography/md5-hasher';
import { TokenService } from '@/infra/auth/auth.service';
import { IpLocationService } from '@/core/services/ip-location.service';
import { NodemailerService } from '../adapters/mail/nodemailer.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [MedicalAuthenticateController],
  imports: [DatabaseModule],
  providers: [
    IpLocationService,
    MedicalAuthenticateUseCase,
    {
      provide: 'Hasher',
      useClass: Md5Hasher,
    },
    {
      provide: 'MailEntity',
      useClass: NodemailerService,
    },
    TokenService,
  ],
})
export class MedicalModule {}
