import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import {
  MedicalSchedulerMapper,
  RawMedicalSchedulingRow,
} from '../mappers/medical-scheduler.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMedicalSchedulerRepository
  implements MedicalSchedulerRepository
{
  constructor(private db: PrismaClinicasService) {}

  async findByMedicalId(id: string, fromDate: Date, limit = 100) {
    const limitParam = limit ?? 100;

    const result = await this.db.$queryRaw<RawMedicalSchedulingRow[]>`
      SELECT
        paciente_id,
        inicio,
        fim
      FROM ponto.tb_agenda_exames
      WHERE medico_agenda = ${Number(id)}
        AND data >= ${fromDate}
      ORDER BY data ASC, inicio ASC
      LIMIT ${limitParam};
    `;

    return result.map((row) => MedicalSchedulerMapper.toDomain(row));
  }
}
