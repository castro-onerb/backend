import { CRM } from '@/core/object-values/crm';
import { IMedicalRepository } from '@/domain/professional/app/repositories/medical.repository';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import { MedicalRawResult } from '@/domain/professional/enterprise/@types/raw.medical';

export class PrismaMedicalRepository implements IMedicalRepository {
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
            concat(conselho, '-', upper(uf_profissional)) as crm
      FROM tb_operador
      WHERE ${crm.value} = concat(conselho, '-', upper(uf_profissional))
    `;

    return result;
  }
}
