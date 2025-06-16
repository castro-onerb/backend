import { SchedulingProps } from '@/core/@types/scheduling';
import { UniqueID } from '@/core/object-values/unique-id';

export interface IMedicalSchedulingProps extends SchedulingProps {
  patientId: UniqueID | null;
  status: string;
  patientName: string;
  gender: {
    key: 'M' | 'F';
    label: 'Masculino' | 'Feminino' | 'Outro';
  };
  queueType: 'urgency' | 'special' | 'priority' | 'normal';
  modality: 'in_person' | 'telemedicine' | 'unknown';
  // agreement: string;
  dateAtendance: Date;
  laudo: string;
  exame: string;
  birth: Date;
  active: boolean;
  // procedure: string;
  confirmed: boolean;
  // missed: boolean;
  // arrival: Date;
  canceledAt: Date;
}
