import { Injectable } from '@nestjs/common';
import { RequirementsRepository } from '@/app/repositories/requirements.repository';
import { Requirement } from '@/domain/auth/entities/requirement.entity';
import { PrismaClinicasService } from '../clinicas/prisma-clinicas.service';

@Injectable()
export class PrismaRequirementsRepository implements RequirementsRepository {
  constructor(private readonly prisma: PrismaClinicasService) {}

  async findManyByUserId(userId: string): Promise<Requirement[]> {
    const result = await this.prisma.$queryRawUnsafe<
      Array<{
        email_valid: boolean;
      }>
    >(
      `
        SELECT
          email IS NOT NULL AND email LIKE '%@%' AS email_valid
        FROM ponto.tb_operador
        WHERE operador_id = $1
      `,
      Number(userId),
    );

    const status = result[0];

    return [
      Requirement.create({
        name: 'email_valid',
        satisfied: status.email_valid,
      }),
    ];
  }
}
