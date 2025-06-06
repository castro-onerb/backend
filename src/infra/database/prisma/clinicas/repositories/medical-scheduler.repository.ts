import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import { IMedicalSchedulingProps } from '@/domain/professional/@types/medical-scheduling';

export class PrismaMedicalSchedulerRepository
  implements MedicalSchedulerRepository
{
  constructor(private db: PrismaClinicasService) {}

  async findByMedicalId(id: string) {
    const result = this.db.$queryRaw<IMedicalSchedulingProps[]>`
      SELECT
        paciente_id,
        tuotempo as modality,
        confirmacao,
    `;
  }
}
