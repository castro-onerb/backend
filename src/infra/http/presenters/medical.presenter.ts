import { Medical } from '@/domain/professional/entities/medical.entity';

export class MedicalPresenter {
  static toHTTP(medical: Medical) {
    return {
      id: medical.id.toString(),
      email: medical.email,
    };
  }
}
