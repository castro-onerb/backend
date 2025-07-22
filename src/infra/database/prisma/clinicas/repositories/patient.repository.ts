import { PatientRepository } from '@/app/repositories/patient.repository';
import { PatientRaw } from '@/domain/patient/@types/raw.patient';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaPatientRepository implements PatientRepository {
  constructor(private db: PrismaClinicasService) {}

  async findByCpf(cpf: string): Promise<PatientRaw[] | null> {
    try {
      const result = await this.db.$queryRaw<PatientRaw[]>(
        Prisma.sql`
          SELECT paciente_id as id,
                senha_app as password,
                celular,
                ativo as active,
                nome as fullname,
                cpf
          FROM ponto.tb_paciente
          WHERE cpf = ${cpf}
        `,
      );

      return result.length > 0 ? result : null;
    } catch (error) {
      console.error('Erro na query raw findByCpf:', error);
      throw new Error('Erro ao buscar paciente por cpf.');
    }
  }
}
