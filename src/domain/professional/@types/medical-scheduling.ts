import { SchedulingProps } from '@/core/@types/scheduling';
import { UniqueID } from '@/core/object-values/unique-id';

export interface IMedicalSchedulingProps extends SchedulingProps {
  patientId: UniqueID;
  patientName: string;
  modality: 'locale' | 'remote';
  agreement: string;
  birth: Date;
  gender: string;
  procedure: string;
  confirmed: Date;
  missed: boolean;
  arrival: Date;
  canceledAt: Date;
}
