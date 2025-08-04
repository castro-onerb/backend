import { UniqueID } from '@/core/object-values/unique-id';
import { formatName } from '@/core/utils/format-name';
import { IMedicalSchedulingProps } from '@/domain/professional/@types/medical-scheduling';
import { mergeDateAndTime } from '@/core/utils/merge-date-time';
import { RawMedicalSchedulingRow } from '../types/medical-scheduler';

export class MedicalSchedulerMapper {
  static toDomain(row: RawMedicalSchedulingRow): IMedicalSchedulingProps {
    return {
      id: new UniqueID(row.id),
      patientId: new UniqueID(row.paciente_id),
      patientName: row.paciente_nome
        ? formatName(row.paciente_nome).name_full
        : '',
      gender: {
        key: row.sexo,
        label:
          row.sexo === 'male'
            ? 'Masculino'
            : row.sexo === 'female'
              ? 'Feminino'
              : 'Outro',
      },
      birth: row.nascimento,
      exam: row.situacaoexame,
      medical_report: row.situacaolaudo,
      queueType: row.prioridade,
      modality: row.tipo_atendimento,
      status: row.situacao,
      active: row.ativo,
      canceledAt: row.data_cancelamento,
      confirmed: row.confirmado,
      dateAtendance: row.data_atendimento,
      paid: row.pago,
      procedure: formatName(row.procedimento).name,
      start: mergeDateAndTime(row.data_atendimento, row.inicio),
      end: mergeDateAndTime(row.data_atendimento, row.fim),
      realizedAt: row.data_realizado,
    };
  }
}
