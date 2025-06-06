import { CRM } from '@/core/object-values/crm';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import { MedicalRawResult } from '@/domain/professional/@types/raw.medical';
import { MedicalRepository } from '@/app/repositories/medical.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMedicalRepository implements MedicalRepository {
  constructor(private db: PrismaClinicasService) {}

  async findByCrm(crm: CRM): Promise<MedicalRawResult[] | null> {
    const result = await this.db.$queryRaw<MedicalRawResult[]>`
      SELECT operador_id as id,
            usuario as username,
            senha as password,
            email,
            perfil_id as type,
            ativo as active,
            nome as fullname,
            cpf,
            concat(conselho, '-', upper(uf_conselho)) as crm
      FROM ponto.tb_operador
      WHERE ${crm.value} = concat(conselho, '-', upper(uf_conselho))
    `;

    return result;
  }
}
