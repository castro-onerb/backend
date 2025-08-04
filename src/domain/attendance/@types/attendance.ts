import { UniqueID } from '@/core/object-values/unique-id';

export type AttendanceEntityProps = {
  patientId: UniqueID;
  medicalId: UniqueID;
  startedAt?: Date;
  finishedAt?: Date;
  status:
    | 'stand_by'
    | 'in_progress'
    | 'finished'
    | 'cancelled'
    | 'blocked'
    | 'missed';
  summary?: string;
  attachments?: string[];
  prescriptionsIds?: string[];
  reportId?: UniqueID;
  modality: 'telemedicine' | 'in_person' | 'unknown';
  createdAt: Date;
  updatedAt?: Date;
};
