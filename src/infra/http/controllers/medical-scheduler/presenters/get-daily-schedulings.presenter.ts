import { IMedicalSchedulingProps } from '@/domain/professional/@types/medical-scheduling';
import { MarkCanCallRole } from '../roles/mark-can-call.role';
import dayjs from '@/core/config/dayjs.config';

interface IGetDailySchedulingsPresenterDto {
  id: string;
  patient_id: string;
  patient_name: string;
  start: string;
  end: string;
  active: boolean;
  paid: boolean;
  procedure: string;
  status: string;
  birth: string;
  canceled_at: string | null;
  confirmed_at: string | null;
  date_atendance: string;
  exam: string;
  gender: { key: 'male' | 'female' | 'other'; label: string };
  medical_report: string | null;
  modality: 'in_person' | 'telemedicine' | 'unknown';
  queue_type: 'urgent' | 'special' | 'priority' | 'normal';
  can_call: boolean;
}

export class GetDailySchedulingsPresenter {
  static toHTTP(
    schedulings: IMedicalSchedulingProps[],
  ): IGetDailySchedulingsPresenterDto[] {
    return schedulings.map((scheduling) => {
      const now = dayjs();
      const deadline = dayjs(scheduling.start).add(10, 'hour');

      const can_call = MarkCanCallRole({
        canceled: !dayjs(scheduling.canceledAt).isValid(),
        realized: !dayjs(scheduling.realizedAt).isValid(),
        within_carency: now.isBefore(deadline),
      });

      return {
        id: scheduling.id.toString(),
        patient_id: scheduling.patientId.toString(),
        patient_name: scheduling.patientName,
        gender: {
          key: scheduling.gender.key,
          label: scheduling.gender.label,
        },
        start: scheduling.start.toString(),
        end: scheduling.end.toString(),
        active: scheduling.active,
        paid: scheduling.paid,
        procedure: scheduling.procedure,
        status: scheduling.status,
        birth: scheduling.birth.toString(),
        queue_type: scheduling.queueType,
        modality: scheduling.modality,
        date_atendance: scheduling.dateAtendance.toString(),
        medical_report: scheduling.medical_report,
        exam: scheduling.exam,
        canceled_at: scheduling.canceledAt
          ? scheduling.canceledAt.toString()
          : null,
        confirmed_at: scheduling.confirmed
          ? scheduling.confirmed.toString()
          : null,
        can_call: can_call,
      };
    });
  }
}
