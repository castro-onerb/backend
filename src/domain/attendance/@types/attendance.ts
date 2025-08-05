import { UniqueID } from '@/core/object-values/unique-id';

export type AttendanceEntityProps = {
  patientId: UniqueID;
  medicalId: UniqueID;
  startedAt?: Date;
  finishedAt?: Date;
  status:
    | 'free'
    | 'in_attendance'
    | 'appoimented'
    | 'finished'
    | 'cancelled'
    | 'blocked';
  observations?: string;
  modality: 'telemedicine' | 'in_person' | 'unknown';
  createdAt: Date;
  updatedAt?: Date;
};
