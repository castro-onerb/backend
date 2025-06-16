import { UniqueID } from '@/core/object-values/unique-id';
import { formatName } from '@/core/utils/format-name';
import { IMedicalSchedulingProps } from '@/domain/professional/@types/medical-scheduling';
import { mergeDateAndTime } from '@/core/utils/merge-date-time';

export interface RawMedicalSchedulingRow {
  paciente_id: string;
  situacao: string;
  inicio: string;
  fim: string;
  data_atendimento: Date;
  situacaoexame: string;
  situacaolaudo: string;
  paciente_nome: string;
  sexo: 'M' | 'F';
  prioridade: 'urgency' | 'special' | 'priority' | 'normal';
  tipo_atendimento: 'in_person' | 'telemedicine' | 'unknown';
  nascimento: Date;
  origin: null | 'INTEGRADO' | 'B2B';
  ativo: boolean;
  confirmado: boolean;
  data_cancelamento: Date;
}

export class MedicalSchedulerMapper {
  static toDomain(row: RawMedicalSchedulingRow): IMedicalSchedulingProps {
    return {
      patientId: row.paciente_id ? new UniqueID(row.paciente_id) : null,
      patientName: row.paciente_nome
        ? formatName(row.paciente_nome).name_full
        : '',
      gender: {
        key: row.sexo,
        label:
          row.sexo === 'M'
            ? 'Masculino'
            : row.sexo === 'F'
              ? 'Feminino'
              : 'Outro',
      },
      birth: row.nascimento,
      exame: row.situacaoexame,
      laudo: row.situacaolaudo,
      queueType: row.prioridade,
      modality: row.tipo_atendimento,
      status: row.situacao,
      active: row.ativo,
      canceledAt: row.data_cancelamento,
      confirmed: row.confirmado,
      dateAtendance: row.data_atendimento,
      start: mergeDateAndTime(row.data_atendimento, row.inicio),
      end: mergeDateAndTime(row.data_atendimento, row.fim),
    };
  }
}
