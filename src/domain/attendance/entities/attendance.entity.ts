import dayjs from '@/core/config/dayjs.config';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { AttendanceEntityProps } from '../@types/attendance';
import { UniqueID } from '@/core/object-values/unique-id';
import {
  AttendanceAlreadyFinishedError,
  AttendanceInvalidFinishError,
  AttendanceInvalidStartError,
} from '@/domain/errors';
import { AttendanceStarted } from '../events/attendance-started.event';

export class Attendance extends AggregateRoot<AttendanceEntityProps> {
  private constructor(props: AttendanceEntityProps, id?: UniqueID) {
    super(props, id);
  }

  static create(props: AttendanceEntityProps, id?: UniqueID) {
    return new Attendance(props, id);
  }

  // ========== Getters ==========

  get patientId() {
    return this.props.patientId;
  }

  get medicalId() {
    return this.props.medicalId;
  }

  get startedAt() {
    return this.props.startedAt;
  }

  get finishedAt() {
    return this.props.finishedAt;
  }

  get status() {
    return this.props.status;
  }

  get businessId() {
    return this.props.businessId;
  }

  get guideTicket() {
    return this.props.guideTicket;
  }

  get procedureTussId() {
    return this.props.procedureTussId;
  }

  get modality() {
    return this.props.modality;
  }

  get observations() {
    return this.props.observations;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  // ========== Métodos de Domínio ==========

  start() {
    if (this.props.status !== 'free') {
      throw new AttendanceInvalidStartError();
    }

    const now = dayjs().toDate();

    this.props.startedAt = now;
    this.props.status = 'in_attendance';

    this.props.realized = true;
    this.props.operatorAttendance = this.props.medicalId;
    this.props.dateRealized = now;

    this.props.attendance = true;
    this.props.operatorAttendance = this.props.medicalId;
    this.props.dateAttendance = now;
    this.touch();

    this.addDomainEvent(
      new AttendanceStarted({
        aggregateId: this.id,
        businessId: this.businessId,
        patientId: this.patientId,
        medicalId: this.medicalId,
        guideTicket: this.guideTicket,
        type: 'CONSULTA',
        procedureTussId: this.procedureTussId,
      }),
    );
  }

  finish() {
    if (this.props.status !== 'in_attendance') {
      throw new AttendanceInvalidFinishError();
    }

    this.props.finishedAt = new Date();
    this.props.status = 'finished';
    this.touch();
  }

  cancel() {
    if (this.props.status === 'finished') {
      throw new AttendanceAlreadyFinishedError();
    }

    this.props.status = 'cancelled';
    this.touch();
  }

  // ========== Utilitário interno ==========

  private touch() {
    this.props.updatedAt = new Date();
  }
}
