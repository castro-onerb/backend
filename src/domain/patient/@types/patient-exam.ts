export interface IPatientExamProps {
  ticket: string;
  patientId: string;
  examId: string;
  professionalName: string;
  procedure: string;
  scheduledDate: Date;
  performedDate: Date;
  observations?: string;
  group: string;
  paid: boolean;
  status: string;
  estimatedDate: Date;
  createdAt: Date;
  updatedAt?: Date;
}
