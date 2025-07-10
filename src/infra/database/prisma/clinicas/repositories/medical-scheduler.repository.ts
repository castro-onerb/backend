import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import { MedicalSchedulerMapper } from '../mappers/medical-scheduler.mapper';
import { Injectable } from '@nestjs/common';
import {
  IMedicalSchedulingProps,
  IMonthlySchedulingOverview,
} from '@/domain/professional/@types/medical-scheduling';
import dayjs from '@/core/config/dayjs.config';
import {
  RawMedicalSchedulingRow,
  RawMonthlySchedulingOverviewRow,
} from '../types/medical-scheduler';

@Injectable()
export class PrismaMedicalSchedulerRepository
  implements MedicalSchedulerRepository
{
  constructor(private db: PrismaClinicasService) {}

  async getDailySchedulingsByMedicalId(
    id: string,
    date: Date,
  ): Promise<IMedicalSchedulingProps[] | null> {
    const dateString = dayjs(date).format('YYYY-MM-DD');

    const result = await this.db.$queryRaw<RawMedicalSchedulingRow[]>`
      SELECT
        op.pronto AS atendimento_online,
        sched.*
      FROM ponto.vw_medical_scheduler sched
      LEFT JOIN ponto.tb_operador op ON op.operador_id = ${Number(id)}
      WHERE
        (
          (agenda_do_medico = ${Number(id)})
          OR (
            (agenda_do_medico IS NULL OR agenda_do_medico = ${Number(id)})
            AND pronto_atendimento = TRUE
            AND situacao_raw = 'OK'
            AND op.pronto = TRUE
          )
        )
        AND data_atendimento = ${dateString}::date
      ORDER BY data_atendimento ASC
    `;
    return result.map((row) => MedicalSchedulerMapper.toDomain(row));
  }

  async findByMedicalId(id: string, start: Date, end: Date) {
    const result = await this.db.$queryRaw<RawMedicalSchedulingRow[]>`
      SELECT
        op.pronto AS atendimento_online,
        sched.*
      FROM ponto.vw_medical_scheduler sched
      LEFT JOIN ponto.tb_operador op ON op.operador_id = ${Number(id)}
      WHERE (
        (agenda_do_medico = ${Number(id)})
        OR (
          (agenda_do_medico IS NULL OR agenda_do_medico = ${Number(id)})
          AND pronto_atendimento = TRUE
          AND situacao_raw = 'OK'
          AND op.pronto = TRUE
        )
      ) AND data_atendimento BETWEEN ${start} AND ${end}
      ORDER BY data_atendimento ASC;
    `;
    return result.map((row) => MedicalSchedulerMapper.toDomain(row));
  }

  async getMonthlySchedulingOverviewByMedicalId(
    id: string,
    start: Date,
    end: Date,
  ): Promise<IMonthlySchedulingOverview[]> {
    const result = await this.db.$queryRaw<RawMonthlySchedulingOverviewRow[]>`
    WITH ranked AS (
      SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY data_atendimento ORDER BY inicio ASC) AS rn,
        COUNT(*) OVER (PARTITION BY data_atendimento) AS total_agendamentos
      FROM ponto.vw_medical_scheduler
      WHERE (
        (agenda_do_medico = ${Number(id)})
        OR (
          (agenda_do_medico IS NULL OR agenda_do_medico = ${Number(id)})
          AND pronto_atendimento = TRUE
          AND situacao_raw = 'OK'
        )
      )
      AND data_atendimento BETWEEN ${start}::date AND ${end}::date
    )
    SELECT
      TO_CHAR(data_atendimento, 'YYYY-MM-DD') AS data_atendimento,
      total_agendamentos,
      inicio,
      fim,
      paciente_nome,
      prioridade,
      tipo_atendimento
    FROM ranked
    WHERE rn = 1
    ORDER BY data_atendimento ASC;
  `;

    return result.map((row) => ({
      date: dayjs(row.data_atendimento).format('YYYY-MM-DD'),
      count: Number(row.total_agendamentos),
      representative: {
        patientName: row.paciente_nome,
        start: row.inicio,
        end: row.fim,
        modality: row.tipo_atendimento as
          | 'in_person'
          | 'telemedicine'
          | 'unknown',
        queueType: row.prioridade as
          | 'urgency'
          | 'special'
          | 'priority'
          | 'normal',
      },
    }));
  }
}
