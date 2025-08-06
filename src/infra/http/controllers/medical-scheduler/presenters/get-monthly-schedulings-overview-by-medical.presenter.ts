import { formatName } from '@/core/utils/format-name';
import { IMonthlySchedulingOverview } from '@/domain/professional/@types/medical-scheduling';
import dayjs from '@/core/config/dayjs.config';
import { MarkCanCallRole } from '../roles/mark-can-call.role';

interface IFetchOverviewSchedulingsPresenterDto {
  date: string;
  count: number;
  representative: {
    patient_name: string;
    start: string;
    end: string;
    modality: 'in_person' | 'telemedicine' | 'unknown';
    queue_type: 'urgent' | 'special' | 'priority' | 'normal';
    procedure: string;
    birth: string | null;
    paid: boolean;
    confirmed: boolean;
    canceled_at: string | null;
    realized_at: string | null;
    status: string;
    can_call: boolean;
  };
}

export class GetMonthlySchedulingsPresenter {
  static toHTTP(
    schedulings: IMonthlySchedulingOverview[],
  ): IFetchOverviewSchedulingsPresenterDto[] {
    return schedulings.map((scheduling) => {
      const now = dayjs();
      const deadline = dayjs(scheduling.representative.start).add(10, 'hour');

      const can_call = MarkCanCallRole({
        cancelled: !dayjs(scheduling.representative.canceledAt).isValid(),
        paid: scheduling.representative.paid,
        realized: !dayjs(scheduling.representative.realizedAt).isValid(),
        within_carency: now.isBefore(deadline),
      });

      return {
        date: scheduling.date.toString(),
        count: scheduling.count,
        representative: {
          patient_name: formatName(scheduling.representative.patientName)
            .name_full,
          start: dayjs(scheduling.representative.start).toString(),
          end: dayjs(scheduling.representative.end).toString(),
          modality: scheduling.representative.modality,
          queue_type: scheduling.representative.queueType,
          procedure: formatName(scheduling.representative.procedure).name_full,
          birth: scheduling.representative.birth
            ? dayjs(scheduling.representative.birth).toString()
            : null,
          paid: scheduling.representative.paid,
          confirmed: scheduling.representative.confirmed,
          canceled_at: scheduling.representative.canceledAt
            ? dayjs(scheduling.representative.canceledAt).toString()
            : null,
          realized_at: scheduling.representative.realizedAt
            ? dayjs(scheduling.representative.realizedAt).toString()
            : null,
          status: scheduling.representative.status,
          can_call: can_call,
        },
      };
    });
  }
}
