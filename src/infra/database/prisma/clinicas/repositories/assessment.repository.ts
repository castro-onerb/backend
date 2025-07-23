import { AssessmentRepository } from '@/app/repositories/assessment.repository';
import { IAssessmentProps } from '@/domain/patient/@types/assessment';
import { AssessmentRaw } from '@/domain/patient/@types/raw.assessment';
import { Injectable } from '@nestjs/common';
import { AssessmentMapper } from '../mappers/assessment.mapper';
import { PrismaClinicasService } from '../prisma-clinicas.service';

@Injectable()
export class PrismaAssessmentRepository implements AssessmentRepository {
  constructor(private readonly db: PrismaClinicasService) {}

  async findByAttendanceId(attendanceId: string): Promise<IAssessmentProps | null> {
    try {
      // Busca pelos dados da guia de ambulatório e comorbidades
      const result = await this.db.$queryRaw<AssessmentRaw[]>`
        SELECT 
          ag.ambulatorio_guia_id,
          ag.paciente_id,
          ag.peso,
          ag.altura,
          ag.alergia_triagem,
          ag.pasistolica,
          ag.padiastolica,
          ag.pulso,
          ag.temperatura,
          ag.pressao_arterial,
          ag.spo2,
          ag.medicacoes,
          ag.precisa_atestado,
          tc.nome AS nome_comorbidade,
          ts.nome AS nome_sintoma
        FROM ponto.tb_ambulatorio_guia ag
        LEFT JOIN ponto.tb_guia_comorbidade tgc ON ag.ambulatorio_guia_id = tgc.guia_id
        LEFT JOIN ponto.tb_comorbidades tc ON tgc.comorbidade_id = tc.comorbidades_id
        LEFT JOIN ponto.tb_guia_sintomas tgs ON ag.ambulatorio_guia_id = tgs.guia_id
        LEFT JOIN ponto.tb_sintomas ts ON tgs.sintoma_id = ts.sintomas_id
        WHERE ag.ambulatorio_guia_id = ${Number(attendanceId)}
        ORDER BY ag.ambulatorio_guia_id DESC
      `;
      console.log('resultado do banco',result);
      return AssessmentMapper.toDomain(result);
    } catch (error) {
      console.error('Erro ao buscar triagem por attendance_id:', error);
      throw new Error('Erro ao buscar dados de triagem.');
    }
  }
} 