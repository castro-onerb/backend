import { PrismaClinicasService } from '../prisma-clinicas.service';
import { OperatorRawResult } from '@/domain/professional/@types/raw.operator';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { OperatorRepository } from '@/app/repositories/operator.repository';

@Injectable()
export class PrismaOperatorRepository implements OperatorRepository {
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

  async updatePassword(
    props: { username?: string; email?: string },
    password?: string,
  ): Promise<boolean> {
    if (!password) {
      throw new Error('A nova senha é obrigatória.');
    }

    if (!props.username && !props.email) {
      throw new Error('É necessário fornecer um usuário ou um email válido.');
    }

    try {
      const whereClause = props.username
        ? Prisma.sql`usuario = ${props.username}`
        : Prisma.sql`email = ${props.email}`;

      const result = await this.db.$executeRaw(
        Prisma.sql`
        UPDATE tb_operador
        SET senha = ${password}
        WHERE ${whereClause}
      `,
      );

      return result > 0;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw new Error('Erro ao atualizar a senha do operador.');
    }
  }
}
