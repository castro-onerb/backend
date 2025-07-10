import { SchedulingProps } from '@/core/@types/scheduling';
import { UniqueID } from '@/core/object-values/unique-id';

export interface IMedicalSchedulingProps extends SchedulingProps {
  id: string;
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
  paid: boolean;
  active: boolean;
  procedure: string;
  confirmed: boolean;
  // arrival: Date;
  canceledAt: Date;
}

export interface IMonthlySchedulingOverview {
  date: string;
  count: number;
  representative: {
    patientName: string;
    start: string;
    end: string;
    modality: 'in_person' | 'telemedicine' | 'unknown';
    queueType: 'urgency' | 'special' | 'priority' | 'normal';
  };
}
