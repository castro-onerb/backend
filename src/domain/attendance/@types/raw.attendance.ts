export type AttendanceRaw = {
  id: string;
  patient_id: string;
  medical_id: string;
  started_at?: string;
  finished_at?: string;
  status:
    | 'stand_by'
    | 'in_progress'
    | 'finished'
    | 'cancelled'
    | 'blocked'
    | 'missed';
  modality: 'in_person' | 'telemedicine' | 'unknown';
  created_at: string;
  updated_at: string;
  summary?: string;
  attachments?: string[];
  prescriptions_ids?: string[];
  report_id?: string;
};
