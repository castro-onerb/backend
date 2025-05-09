import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MedicalAuthenticateUseCaseRequest } from './dto';
import { IMedicalRepository } from '../../repositories/medical.repository';
import { Hasher } from 'src/core/cryptography/hasher';

@Injectable()
export class MedicalAuthenticateUseCase {
  constructor(
    private medicalRepository: IMedicalRepository,
    @Inject('Hasher') private readonly hasher: Hasher,
  ) {}

  async execute({ crm, password }: MedicalAuthenticateUseCaseRequest) {
    const medical = await this.medicalRepository.findByCrm(crm);

    if (!medical) {
      throw new UnauthorizedException('Não localizamos o CRM informado.');
    }

    const isValid = await medical.compare(password, this.hasher);

    if (!isValid) {
      throw new UnauthorizedException('Senha inválida.');
    }

    return medical;
  }
}
