import { Module } from '@nestjs/common';
import { MedicalAuthenticateUseCase } from 'src/domain/professional/app/use-cases/authenticate-medical/authenticate-medical.use-case';
import { BcryptHasher } from 'src/infra/cryptography/bcrypt-hasher';

@Module({
  providers: [
    MedicalAuthenticateUseCase,
    {
      provide: 'Hasher',
      useClass: BcryptHasher,
    },
  ],
})
export class MedicalModule {}
