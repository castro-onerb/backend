import { Module } from '@nestjs/common';
import { OperatorAuthenticateUseCase } from '@/app/use-cases/auth/authenticate-operator.use-case';
import { OperatorAuthenticateController } from '../http/controllers/auth/operator/authenticate-operator.controller';
import { Md5Hasher } from '../cryptography/md5-hasher';
import { TokenService } from '@/infra/auth/auth.service';
import { NodemailerService } from '../adapters/mail/nodemailer.service';
import { IpLocationService } from '@/core/services/ip-location.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [OperatorAuthenticateController],
  imports: [DatabaseModule],
  providers: [
    IpLocationService,
    OperatorAuthenticateUseCase,
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
export class OperatorModule {}
