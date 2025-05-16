import { IOperatorRepository } from '@/domain/professional/app/repositories/operator.repository';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import { OperatorRawResult } from '@/domain/professional/enterprise/@types/raw.operator';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaOperatorRepository implements IOperatorRepository {
  constructor(private db: PrismaClinicasService) {}

  async findByEmail(email: string): Promise<OperatorRawResult[] | null> {
    try {
      const result = await this.db.$queryRaw<OperatorRawResult[]>(
        Prisma.sql`
        SELECT operador_id as id,
               usuario as username,
               senha as password,
               email,
               perfil_id as type,
               ativo as active,
               nome as fullname,
               cpf
        FROM tb_operador
        WHERE email = ${email}
      `,
      );

      return result.length > 0 ? result : null;
    } catch (error) {
      console.error('Erro na query raw findByEmail:', error);
      throw new Error('Erro ao buscar operador por e-mail.');
    }
  }

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
