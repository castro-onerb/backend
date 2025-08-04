import { AttendanceRepository } from '@/app/repositories/attendance.repository';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { AttendanceRaw } from '@/domain/attendance/@types/raw.attendance';
import { AttendanceMapper } from '../mappers/attendance.mapper';

@Injectable()
export class PrismaAttendanceRepository implements AttendanceRepository {
  constructor(private db: PrismaClinicasService) {}

  async findByAttendanceId(id: string) {
    try {
      const result = await this.db.$queryRaw<AttendanceRaw[]>(
        Prisma.sql`
          SELECT agenda_exames_id as id,
                paciente_id as patient_id,
                medico_agenda as medical_id,
                data_cadastro as created_at,
                data_atualizacao as updated_at,
                data_realizacao as finished_at,
                data_realizacao as started_at
          FROM ponto.tb_agenda_exames
          WHERE agenda_exames_id = ${Number(id)}
          LIMIT 1
        `,
      );

      if (!result.length) return null;
      return AttendanceMapper.toDomain(result[0]);
    } catch (error) {
      console.error('Erro na query raw findByAttendanceId:', error);
      throw new Error('Erro ao buscar o atendimento solicitado.');
    }
  }
}
