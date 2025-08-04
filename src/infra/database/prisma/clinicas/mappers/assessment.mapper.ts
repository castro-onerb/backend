import { IAssessmentProps } from '@/domain/patient/@types/assessment';
import { AssessmentRaw } from '@/domain/patient/@types/raw.assessment';

export class AssessmentMapper {
  static toDomain(rows: AssessmentRaw[]): IAssessmentProps | null {
    if (!rows || rows.length === 0) {
      return null;
    }

    const firstRow = rows[0];

    // Agrupa comorbidades e sintomas únicos
    const comorbidities = rows
      .map((row) => row.nome_comorbidade)
      .filter((value): value is string => value !== null && value !== undefined)
      .filter((value, index, self) => self.indexOf(value) === index);

    const symptoms = rows
      .map((row) => row.nome_sintoma)
      .filter((value): value is string => value !== null && value !== undefined)
      .filter((value, index, self) => self.indexOf(value) === index);

    // Monta pressão arterial se ambos os valores existirem
    let bloodPressure: string | undefined;
    if (firstRow.pasistolica && firstRow.padiastolica) {
      bloodPressure = `${firstRow.pasistolica}/${firstRow.padiastolica}`;
    } else if (firstRow.pressao_arterial) {
      bloodPressure = firstRow.pressao_arterial;
    }

    return {
      attendanceId: firstRow.ambulatorio_guia_id,
      patientId: firstRow.paciente_id,
      weight: firstRow.peso || undefined,
      height: firstRow.altura || undefined,
      bloodPressure: bloodPressure || undefined,
      heartRate: firstRow.pulso || undefined,
      respiratoryRate: undefined, // Não encontrado na estrutura PHP
      temperature: firstRow.temperatura || undefined,
      oxygenSaturation: firstRow.spo2 || undefined,
      glycemia: undefined, // Não encontrado na estrutura PHP
      pressurePattern: undefined, // Não encontrado na estrutura PHP
      chiefComplaint: firstRow.alergia_triagem || undefined,
      painScore: undefined, // Não encontrado na estrutura PHP
      painLocation: undefined, // Não encontrado na estrutura PHP
      painType: undefined, // Não encontrado na estrutura PHP
      painFactors: undefined, // Não encontrado na estrutura PHP
      comorbidities: comorbidities.length > 0 ? comorbidities : undefined,
      symptoms: symptoms.length > 0 ? symptoms : undefined,
    };
  }
}
