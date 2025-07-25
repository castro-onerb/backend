export type AssessmentRaw = {
  ambulatorio_guia_id: string;
  paciente_id: string;
  peso?: string;
  altura?: string;
  alergia_triagem?: string;
  pasistolica?: string;
  padiastolica?: string;
  pulso?: number;
  temperatura?: string;
  pressao_arterial?: string;
  spo2?: number;
  medicacoes?: string;
  precisa_atestado?: boolean;
  nome_comorbidade?: string;
  nome_sintoma?: string;
};
