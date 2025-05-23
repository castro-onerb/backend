import { Medical } from '@/domain/professional/entities/medical.entity';
import { CRM } from 'src/core/object-values/crm';

export type MedicalAuthenticateUseCaseRequest = {
  crm: CRM;
  password: string;
};

export type MedicalAuthenticateUseCaseResponse = {
  medical: Medical;
};
