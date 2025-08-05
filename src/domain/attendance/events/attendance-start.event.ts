import { DomainEvent } from '@/core/events/domain-event';
import { UniqueID } from '@/core/object-values/unique-id';
import dayjs from '@/core/config/dayjs.config';

interface AttendanceStartRequest {
  aggregateId: UniqueID;
}

interface AmbulatorioLaudo {}
interface Exames {
  data_cadastro: Date;
}

export class AttendanceStart implements DomainEvent {
  ocurredAt: Date;
  aggregateId: UniqueID;

  constructor(props: AttendanceStartRequest) {
    this.aggregateId = props.aggregateId;
    this.ocurredAt = dayjs().toDate();
  }
}
