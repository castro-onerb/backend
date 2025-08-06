import dayjs from '@/core/config/dayjs.config';
import { UniqueID } from '@/core/object-values/unique-id';
import { AttendanceRaw } from '@/domain/attendance/@types/raw.attendance';
import { Attendance } from '@/domain/attendance/entities/attendance.entity';
import { AttendanceStatusType } from '@/domain/attendance/@types/attendance-status';

export class AttendanceMapper {
  static toDomain(row: AttendanceRaw): Attendance {
    return Attendance.create(
      {
        patientId: new UniqueID(row.patient_id),
        medicalId: new UniqueID(row.medical_id),
        status: row.status as AttendanceStatusType,
        modality: row.modality,
        observations: row.observations,
        createdAt: dayjs(row.created_at).toDate(),
        finishedAt: dayjs(row.finished_at).isValid()
          ? dayjs(row.finished_at).toDate()
          : undefined,
        startedAt: dayjs(row.started_at).isValid()
          ? dayjs(row.started_at).toDate()
          : undefined,
        updatedAt: dayjs(row.updated_at).isValid()
          ? dayjs(row.updated_at).toDate()
          : undefined,
        businessId: new UniqueID(row.business_id),
        guideTicket: new UniqueID(row.guide_ticket),
        procedureTussId: new UniqueID(row.procedure_tuss_id),
      },
      new UniqueID(row.id),
    );
  }

  static toPrisma(attendance: Attendance) {
    const props = attendance['props'];

    return {
      agenda_exames_id: Number(attendance.id.toString()),
      data_realizacao: props.startedAt ?? null,
      data_atualizacao: props.updatedAt ?? new Date(),
      status: props.status,
      observacoes: props.observations ?? null,
      medico_agenda: props.medicalId
        ? Number(props.medicalId.toString())
        : null,
      forma_atendimento: props.modality ?? null,
      operador_realizacao: props.operatorRealized
        ? Number(props.operatorRealized.toString())
        : null,
      operador_atendimento: props.operatorAttendance
        ? Number(props.operatorAttendance.toString())
        : null,
      data_atendimento: props.dateAttendance ?? null,
      realizada: props.realized ?? null,
      atendimento: props.attendance ?? null,
    };
  }
}
