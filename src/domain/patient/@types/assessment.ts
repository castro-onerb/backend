export interface IAssessmentProps {
  attendanceId: string;
  patientId: string;
  weight?: string;
  height?: string;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: string;
  oxygenSaturation?: number;
  glycemia?: number;
  pressurePattern?: string;
  chiefComplaint?: string;
  painScore?: number;
  painLocation?: string;
  painType?: string;
  painFactors?: string;
  comorbidities?: string[];
  symptoms?: string[];
} 