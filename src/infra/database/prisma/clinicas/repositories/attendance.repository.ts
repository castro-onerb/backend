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
            ae.guia_id as guide_id,
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
    const props = attendance['props'];

    const sql = Prisma.sql`
      UPDATE ponto.tb_agenda_exames
      SET
        data_realizacao = ${props.startedAt ?? null},
        data_atualizacao = ${props.updatedAt},
        status = ${props.status},
        observacoes = ${props.observations ?? null},
        medico_agenda = ${props.medicalId?.toString() ?? null},
        forma_atendimento = ${props.modality ?? null},
        operador_realizacao = ${props.operatorRealized?.toString() ?? null},
        operador_atendimento = ${props.operatorAttendance?.toString() ?? null},
        data_atendimento = ${props.dateAttendance ?? null},
        realizada = ${props.realized ?? null},
        atendimento = ${props.attendance ?? null}
      WHERE agenda_exames_id = ${Number(attendance.id.toString())}
    `;

    await this.db.$executeRawUnsafe(sql.sql, ...sql.values);
  }
}
