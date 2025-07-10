export interface RawMedicalSchedulingRow {
  id: string;
  paciente_id: string;
  situacao: string;
  pago: boolean;
  procedimento: string;
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

export interface RawMonthlySchedulingOverviewRow {
  data_atendimento: Date;
  total_agendamentos: number;
  inicio: string;
  fim: string;
  paciente_nome: string;
  prioridade: string;
  tipo_atendimento: string;
}
