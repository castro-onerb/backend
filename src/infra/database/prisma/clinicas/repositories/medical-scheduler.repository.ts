import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import {
  MedicalSchedulerMapper,
  RawMedicalSchedulingRow,
} from '../mappers/medical-scheduler.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMedicalSchedulerRepository
  implements MedicalSchedulerRepository
{
  constructor(private db: PrismaClinicasService) {}

  async findByMedicalId(id: string, start: Date, end: Date, limit = 100) {
    const limitParam = limit ?? 100;

    const result = await this.db.$queryRaw<RawMedicalSchedulingRow[]>`
      SELECT
        ae.agenda_exames_id,
        ex.situacao as situacaoexame,
        al.situacao as situacaolaudo,
        ae.paciente_id,
        ae.data as data_atendimento,
        ae.inicio,
        ae.fim,
        ae.ativo,
        ae.confirmado,
        ae.data_cancelamento,
        CASE
          WHEN COALESCE(ae.ordenador, '1') = '3' THEN 'urgency'
          WHEN date_part('year', age(current_date, pc.nascimento)) >= 80 THEN 'special'
          WHEN COALESCE(ae.ordenador, '1') = '2' THEN 'priority'
          ELSE 'normal'
        END AS prioridade,
        CASE
          WHEN (ae.pronto_atendimento IS NULL OR ae.pronto_atendimento = false)
            AND (ae.agenda_especialidade IS NULL OR ae.agenda_especialidade = false)
            THEN 'in_person'
          WHEN (ae.pronto_atendimento IS NOT NULL AND ae.pronto_atendimento <> false)
            OR (ae.agenda_especialidade IS NOT NULL AND ae.agenda_especialidade <> false)
            THEN 'telemedicine'
          ELSE 'unknown'
        END AS tipo_atendimento,
        pc.nome AS paciente_nome,
        pc.sexo,
        pc.nascimento,
      CASE
        WHEN ae.situacao = 'OK'
          AND (ae.cancelada IS NULL OR ae.cancelada IS FALSE)
          AND (ae.faltou_manual IS NULL OR ae.faltou_manual IS FALSE)
          AND (al.situacao = 'FINALIZADO')
          AND (ex.situacao = 'FINALIZADO')
        THEN 'finished'
        WHEN ae.situacao = 'OK'
          AND (ae.cancelada IS TRUE
          OR (ae.data_cancelamento IS NOT NULL))
        THEN 'canceled'
        WHEN ae.situacao = 'OK'
          AND (ae.faltou_manual IS TRUE
          OR (
            ex.exames_id IS NULL
            AND al.ambulatorio_laudo_id IS NULL
            AND ae.data_inicio < current_date
          ))
        THEN 'missed'
        WHEN ae.situacao = 'OK'
          AND (al.situacao = 'AGUARDANDO')
          AND (ex.situacao = 'EXECUTANDO')
        THEN 'in_attendance'
        WHEN ae.situacao = 'OK'
          AND (al.situacao IS NULL OR al.situacao = '')
          AND (ex.situacao IS NULL OR ex.situacao = '')
          AND (ae.cancelada IS NULL OR ae.cancelada IS FALSE)
        THEN 'appoimented'
        ELSE 'free'
      END AS situacao
      FROM ponto.tb_agenda_exames ae
        LEFT JOIN ponto.tb_paciente pc
          ON pc.paciente_id = ae.paciente_id
        LEFT JOIN ponto.tb_exames ex
          ON ex.paciente_id = ae.paciente_id
          AND ex.agenda_exames_id = ae.agenda_exames_id
        LEFT JOIN ponto.tb_ambulatorio_laudo al
          ON al.paciente_id = ae.paciente_id
          AND al.exame_id = ex.exames_id
      WHERE ae.medico_agenda = ${Number(id)}
        AND ae.data >= ${start}
        AND ae.data <= ${end}
        AND ae.situacao <> 'LIVRE'
        AND ae.paciente_id IS NOT NULL
      ORDER BY ae.data ASC
      LIMIT ${limitParam};
    `;

    return result.map((row) => MedicalSchedulerMapper.toDomain(row));
  }
}
