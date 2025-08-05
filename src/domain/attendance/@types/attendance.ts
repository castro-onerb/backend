import { UniqueID } from '@/core/object-values/unique-id';
import { AttendanceStatusType } from './attendance-status';

export type AttendanceEntityProps = {
  patientId: UniqueID;
  medicalId: UniqueID;
  businessId: UniqueID;
  guideTicket: UniqueID;
  procedureTussId: UniqueID;
  startedAt?: Date;
  finishedAt?: Date;
  status: AttendanceStatusType;

  attendance?: boolean;
  operatorAttendance?: UniqueID;
  dateAttendance?: Date;

  realized?: boolean;
  operatorRealized?: UniqueID;
  dateRealized?: Date;

  observations?: string;
  modality: 'telemedicine' | 'in_person' | 'unknown';
  createdAt: Date;
  updatedAt?: Date;
};
