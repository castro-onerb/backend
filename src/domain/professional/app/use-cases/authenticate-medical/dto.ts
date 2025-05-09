import { Medical } from 'src/domain/professional/enterprise/entities/medical.entity';

export type MedicalAuthenticateUseCaseRequest = {
  crm: string;
  password: string;
};

export type MedicalAuthenticateUseCaseResponse = {
  medical: Medical;
};
