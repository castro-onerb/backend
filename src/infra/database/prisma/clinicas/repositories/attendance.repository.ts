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
            CASE
              WHEN ae.situacao = 'OK'
                AND (ae.data_realizacao IS NOT NULL)
                AND (ae.cancelada IS NULL OR ae.cancelada IS FALSE)
                AND (ae.faltou_manual IS NULL OR ae.faltou_manual IS FALSE)
                AND (al.situacao = 'FINALIZADO')
                AND (ex.situacao = 'FINALIZADO')
              THEN 'finished'
              WHEN (
                (ae.situacao = 'OK' AND (
                  ae.cancelada IS TRUE
                  OR ae.data_cancelamento IS NOT NULL
                ))
                OR ae.situacao = 'CANCELADO'
              )
              THEN 'cancelled'
              WHEN ae.situacao = 'OK'
                AND (ae.faltou_manual IS TRUE
                OR (
                  ex.exames_id IS NULL
                  AND al.ambulatorio_laudo_id IS NULL
                  AND ae.data < current_date
                ))
              THEN 'missed'
              WHEN ae.situacao = 'OK'
                AND (al.situacao = 'AGUARDANDO')
                AND (ex.situacao = 'EXECUTANDO')
              THEN 'in_attendance'
              WHEN ae.situacao = 'OK'
                AND ae.faturado IS NULL
              THEN 'blocked'
              WHEN ae.situacao = 'OK'
                AND (al.situacao IS NULL OR al.situacao = '' OR al.situacao = 'AGUARDANDO')
                AND (ex.situacao IS NULL OR ex.situacao = '' OR ex.situacao = 'AGUARDANDO')
                AND (ae.cancelada IS NULL OR ae.cancelada IS FALSE)
              THEN 'appoimented'
              ELSE 'free'
            END AS status,
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
}
