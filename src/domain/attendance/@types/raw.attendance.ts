export type AttendanceRaw = {
  id: string;
  patient_id: string;
  medical_id: string;
  started_at?: string;
  finished_at?: string;
  status:
    | 'free'
    | 'in_attendance'
    | 'appoimented'
    | 'finished'
    | 'cancelled'
    | 'blocked';
  modality: 'in_person' | 'telemedicine' | 'unknown';
  observations?: string;
  created_at: string;
  updated_at: string;
  summary?: string;
};
