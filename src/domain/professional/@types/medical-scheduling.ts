import { SchedulingProps } from '@/core/@types/scheduling';
import { UniqueID } from '@/core/object-values/unique-id';

export interface IMedicalSchedulingProps extends SchedulingProps {
  id: UniqueID;
  patientId: UniqueID;
  status: string;
  patientName: string;
  gender: {
    key: 'male' | 'female';
    label: 'Masculino' | 'Feminino' | 'Outro';
  };
  queueType: 'urgent' | 'special' | 'priority' | 'normal';
  modality: 'in_person' | 'telemedicine' | 'unknown';
  // agreement: string;
  dateAtendance: Date;
  medical_report: string;
  exam: string;
  birth: Date;
  paid: boolean;
  active: boolean;
  procedure: string;
  confirmed: boolean;
  // arrival: Date;
  canceledAt: Date;
  realizedAt: Date | null;
}

export interface IMonthlySchedulingOverview {
  date: Date;
  count: number;
  representative: {
    patientName: string;
    start: Date;
    end: Date;
    modality: 'in_person' | 'telemedicine' | 'unknown';
    queueType: 'urgent' | 'special' | 'priority' | 'normal';
    procedure: string;
    birth: Date | null;
    paid: boolean;
    confirmed: boolean;
    canceledAt: Date | null;
    realizedAt: Date | null;
    status: string;
  };
}
