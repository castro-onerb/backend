// create-exams-on-attendance-started.handler.ts
import dayjs from '@/core/config/dayjs.config';
import { EventHandler } from '@/core/events/event-handler';
import { AttendanceStarted } from '@/domain/attendance/events/attendance-started.event';
import { PrismaClinicasService } from '@/infra/database/prisma/clinicas/prisma-clinicas.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CreateExamOnAttendanceStarted
  implements EventHandler<AttendanceStarted>
{
  constructor(private readonly prisma: PrismaClinicasService) {}

  async handle(event: AttendanceStarted) {
    const attendanceId = Number(event.aggregateId.toString());

    const paciente_id = Number(event.patientId.toString());
    const procedimento_tuss_id = Number(event.procedureTussId.toString());
    const guia_id = Number(event.guideTicket.toString());
    const operador_cadastro = Number(event.medicalId.toString());
    const situacao = 'EXECUTANDO';
    const medico_realizador = Number(event.medicalId.toString());
    const empresa_id = Number(event.businessId.toString());
    const tipo = 'CONSULTA';

    const now = dayjs().toDate();

    await this.prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO ponto.tb_exames (
          data_cadastro,
          paciente_id,
          procedimento_tuss_id,
          guia_id,
          operador_cadastro,
          situacao,
          medico_realizador,
          agenda_exames_id,
          empresa_id,
          tipo
        ) VALUES (
          ${now},
          ${paciente_id},
          ${procedimento_tuss_id},
          ${guia_id},
          ${operador_cadastro},
          ${situacao},
          ${medico_realizador},
          ${attendanceId},
          ${empresa_id},
          ${tipo}
        );
      `,
    );

    const [lastExam] = await this.prisma.$queryRaw<{ exames_id: number }[]>`
      SELECT MAX(exames_id) as exames_id
      FROM ponto.tb_exames
      WHERE agenda_exames_id = ${attendanceId};
    `;

    await this.prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO ponto.tb_ambulatorio_laudo (
          exame_id,
          data_cadastro,
          empresa_id,
          situacao,
          operador_cadastro,
          paciente_id,
          procedimento_tuss_id,
          medico_parecer1,
          guia_id,
          tipo
        ) VALUES (
          ${lastExam.exames_id},
          ${now},
          ${empresa_id},
          'AGUARDANDO',
          ${operador_cadastro},
          ${paciente_id},
          ${procedimento_tuss_id},
          ${medico_realizador},
          ${guia_id},
          ${tipo}
        );
      `,
    );
  }
}
