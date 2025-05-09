import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MedicalAuthenticateUseCaseRequest } from './dto';
import { IMedicalRepository } from '../../repositories/medical.repository';

@Injectable()
export class MedicalAuthenticateUseCase {
  constructor(private medicalRepository: IMedicalRepository) {}

  async execute({ crm, password }: MedicalAuthenticateUseCaseRequest) {
    const medical = await this.medicalRepository.findByCrm(crm);

    if (!medical) {
      throw new UnauthorizedException('Não localizamos o CRM informado.');
    }

    if (medical.crm === password) {
    }
  }
}
