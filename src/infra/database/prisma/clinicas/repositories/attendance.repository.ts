import { AttendanceRepository } from '@/app/repositories/attendance.repository';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { AttendanceRaw } from '@/domain/attendance/@types/raw.attendance';
import { AttendanceMapper } from '../mappers/attendance.mapper';
import { Attendance } from '@/domain/attendance/entities/attendance.entity';

@Injectable()
export class PrismaAttendanceRepository implements AttendanceRepository {
  constructor(private db: PrismaClinicasService) {}

  async findByAttendanceId(id: string) {
    try {
      const result = await this.db.$queryRaw<AttendanceRaw[]>(
        Prisma.sql`
          SELECT
            ae.agenda_exames_id as id,
            ae.paciente_id as patient_id,
            ae.medico_agenda as medical_id,
            ae.empresa_id as business_id,
            ae.guia_id as guide_ticket,
            ae.data_cadastro as created_at,
            ae.data_atualizacao as updated_at,
            ae.data_realizacao as finished_at,
            ae.data_realizacao as started_at,
            ae.observacoes as observations,
            ae.status,
            CASE
              WHEN (ae.forma_atendimento LIKE 'presencial%')
                THEN 'in_person'
              WHEN (ae.forma_atendimento LIKE 'telemedicina%')
                THEN 'telemedicine'
              ELSE 'unknown'
            END AS modality
          FROM ponto.tb_agenda_exames ae
            LEFT JOIN ponto.tb_exames ex
              ON ex.agenda_exames_id = ae.agenda_exames_id
            LEFT JOIN ponto.tb_ambulatorio_laudo al
              ON al.exame_id = ex.exames_id
          WHERE ae.agenda_exames_id = ${Number(id)}
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

  async update(attendance: Attendance): Promise<void> {
    const row = AttendanceMapper.toPrisma(attendance);

    const sql = Prisma.sql`
      UPDATE ponto.tb_agenda_exames
      SET
        data_realizacao = ${row.data_realizacao},
        data_atualizacao = ${row.data_atualizacao},
        status = ${row.status},
        observacoes = ${row.observacoes},
        medico_agenda = ${row.medico_agenda},
        forma_atendimento = ${row.forma_atendimento},
        operador_realizacao = ${row.operador_realizacao},
        operador_atendimento = ${row.operador_atendimento},
        data_atendimento = ${row.data_atendimento},
        realizada = ${row.realizada},
        atendimento = ${row.atendimento}
      WHERE agenda_exames_id = ${row.agenda_exames_id}
    `;

    await this.db.$executeRaw(sql);
  }
}
