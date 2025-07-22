import { PatientExamRepository } from '@/app/repositories/patient-exam.repository';
import { IPatientExamProps } from '@/domain/patient/@types/patient-exam';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import { PatientExamRaw } from '@/domain/patient/@types/raw.patient-exam';
import { PatientExamsMapper } from '../mappers/patient-exams.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaPatientExamsRepository implements PatientExamRepository {
  constructor(private readonly db: PrismaClinicasService) {}

  async findByPatientId(
    patientId: string,
    page: number,
    perPage: number,
  ): Promise<IPatientExamProps[]> {
    perPage = perPage <= 100 ? perPage : 100;
    if (page < 1) page = 1;
    if (perPage < 1) perPage = 10;
    const offset = (page - 1) * perPage;

    const result = await this.db.$queryRaw<PatientExamRaw[]>`
      SELECT
        ae.agenda_exames_id AS id,
        ae.paciente_id AS patient_id,
        ae.procedimento_tuss_id AS exam_id,
        pt.nome AS procedure,
        ae.data AS scheduled_date,
        ae.data_cadastro AS created_at,
        ae.data_atualizacao AS updated_at,
        ae.tipo AS group,
        ex.situacao AS status,
        ex.data_cadastro AS performed_date,
        ae.faturado AS paid,
        ex.data_cadastro + INTERVAL '1 day' * COALESCE(pt.tempo_resultado::int, pt.entrega::int, pt.dia_previsao::int) AS estimated_date
      FROM ponto.tb_agenda_exames ae
      INNER JOIN ponto.tb_procedimento_convenio pc
        ON pc.procedimento_convenio_id = ae.procedimento_tuss_id
      INNER JOIN ponto.tb_procedimento_tuss pt
        ON pt.procedimento_tuss_id = pc.procedimento_tuss_id
      INNER JOIN ponto.tb_convenio c
        ON c.convenio_id = pc.convenio_id
      INNER JOIN ponto.tb_exames ex
        ON ex.agenda_exames_id = ae.agenda_exames_id
        AND ex.situacao = 'FINALIZADO'
      WHERE ae.paciente_id = ${Number(patientId)}
        AND ae.tipo = 'EXAME'
      ORDER BY ae.data DESC
      LIMIT ${perPage} OFFSET ${offset};
    `;

    return result.map((row) => PatientExamsMapper.toDomain(row));
  }
}
