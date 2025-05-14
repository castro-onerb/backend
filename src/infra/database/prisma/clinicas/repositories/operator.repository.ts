import { IOperatorRepository } from '@/domain/professional/app/repositories/operator.repository';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import { OperatorRawResult } from '@/domain/professional/enterprise/@types/raw.operator';

export class PrismaOperatorRepository implements IOperatorRepository {
  constructor(private db: PrismaClinicasService) {}
  async findByUsername(username: string): Promise<OperatorRawResult[] | null> {
    const result = await this.db.$queryRaw<OperatorRawResult[]>`
      SELECT operador_id as id,
            usuario as username,
            senha as password,
            email,
            perfil_id as type,
            ativo as active,
            nome as fullname,
            cpf
      FROM tb_operador
      WHERE ${username} = usuario
    `;

    return result;
  }
}
