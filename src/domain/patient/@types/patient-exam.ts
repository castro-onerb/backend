export interface IPatientExamProps {
  ticket: string;
  patientId: string;
  examId: string;
  procedure: string;
  scheduledDate: Date;
  performedDate: Date;
  observations?: string;
  group: string;
  paid: boolean;
  status: string;
  estimated_date: Date;
  createdAt: Date;
  updatedAt?: Date;
}
