export type PatientExamRaw = {
  id: string;
  patient_id: string;
  exam_id: string;
  procedure: string;
  scheduled_date: Date;
  performed_date: Date | null;
  observations: string | null;
  group: string;
  paid: boolean;
  status: string;
  estimated_date: string;
  created_at: Date;
  updated_at: Date;
};
