import { AggregateRoot } from '@/core/entities/aggregate-root';
import { AttendanceEntityProps } from '../@types/attendance';
import { UniqueID } from '@/core/object-values/unique-id';
import {
  AttendanceAlreadyFinishedError,
  AttendanceCannotAttachReportError,
  AttendanceInvalidFinishError,
  AttendanceInvalidStartError,
  AttendanceReportAlreadyAttachedError,
  AttendanceSummaryNotAllowedError,
} from '@/domain/errors';

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

  get summary() {
    return this.props.summary;
  }

  get attachments() {
    return this.props.attachments ?? [];
  }

  get prescriptionsIds() {
    return this.props.prescriptionsIds ?? [];
  }

  get reportId() {
    return this.props.reportId;
  }

  get modality() {
    return this.props.modality;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  // ========== Métodos de Domínio ==========

  start() {
    if (this.props.status !== 'stand_by') {
      throw new AttendanceInvalidStartError();
    }

    this.props.startedAt = new Date();
    this.props.status = 'in_progress';
    this.touch();
  }

  finish() {
    if (this.props.status !== 'in_progress') {
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

  setSummary(summary: string) {
    if (this.props.status !== 'finished') {
      throw new AttendanceSummaryNotAllowedError();
    }

    this.props.summary = summary;
    this.touch();
  }

  addAttachment(fileId: string) {
    this.props.attachments = this.props.attachments ?? [];

    if (this.props.attachments.includes(fileId)) return;

    this.props.attachments.push(fileId);
    this.touch();
  }

  addPrescription(prescriptionId: string) {
    this.props.prescriptionsIds = this.props.prescriptionsIds ?? [];

    if (this.props.prescriptionsIds.includes(prescriptionId)) return;

    this.props.prescriptionsIds.push(prescriptionId);
    this.touch();
  }

  attachReport(reportId: UniqueID) {
    if (this.props.status !== 'finished') {
      throw new AttendanceCannotAttachReportError();
    }

    if (this.props.reportId) {
      throw new AttendanceReportAlreadyAttachedError();
    }

    this.props.reportId = reportId;
    this.touch();
  }

  // ========== Utilitário interno ==========

  private touch() {
    this.props.updatedAt = new Date();
  }
}
