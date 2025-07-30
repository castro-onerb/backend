import dayjs from '@/core/config/dayjs.config';
import { formatName } from '@/core/utils/format-name';
import { IPatientExamProps } from '@/domain/patient/@types/patient-exam';

export class FetchExamsByPatientPresenter {
  static toHTTP(exams: IPatientExamProps[]) {
    return exams.map((exam) => ({
      ticket: exam.ticket,
      patient_id: exam.patientId,
      exam_id: exam.examId,
      professional_name: formatName(
        exam.professionalName,
      ).name_full_abbrev.toLocaleUpperCase(),
      procedure: exam.procedure.toLocaleUpperCase(),
      performed_date: dayjs(exam.performedDate).tz().format('YYYY-MM-DD'),
      scheduled_date: dayjs(exam.scheduledDate).tz().format('YYYY-MM-DD'),
      group: exam.group,
      status: exam.status,
      estimated_date: dayjs(exam.estimatedDate).tz().format('YYYY-MM-DD'),
      updated_at: exam.updatedAt,
      created_at: exam.createdAt,
    }));
  }
}
