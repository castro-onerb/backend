import { CRM } from 'src/core/object-values/crm';
import { Medical } from 'src/domain/professional/enterprise/entities/medical.entity';

export type MedicalAuthenticateUseCaseRequest = {
  crm: CRM;
  password: string;
};

export type MedicalAuthenticateUseCaseResponse = {
  medical: Medical;
};
