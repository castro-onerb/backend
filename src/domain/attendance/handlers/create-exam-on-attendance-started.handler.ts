// create-exams-on-attendance-started.handler.ts
import dayjs from '@/core/config/dayjs.config';
import { EventHandler } from '@/core/events/event-handler';
import { AttendanceStarted } from '@/domain/attendance/events/attendance-started.event';
import { PrismaClinicasService } from '@/infra/database/prisma/clinicas/prisma-clinicas.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateExamOnAttendanceStarted
  implements EventHandler<AttendanceStarted>
{
  constructor(private readonly prisma: PrismaClinicasService) {}

  async handle(event: AttendanceStarted) {
    const attendanceId = Number(event.aggregateId.toString());

    const paciente_id = 123;
    const procedimento_tuss_id = 999;
    const guia_id = 999;
    const operador_cadastro = 999;
    const situacao = 'EXECUTANDO';
    const medico_realizador = 456;
    const empresa_id = 1;
    const tipo = 'CONSULTA';

    const now = dayjs().toDate();

    await this.prisma.$executeRawUnsafe(`
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
        '${now.toISOString()}',
        ${paciente_id},
        ${procedimento_tuss_id},
        ${guia_id},
        ${operador_cadastro},
        '${situacao}',
        ${medico_realizador},
        ${attendanceId},
        ${empresa_id},
        '${tipo}'
      );
    `);
    const [lastExam] = await this.prisma.$queryRaw<{ exames_id: number }[]>`
      SELECT MAX(exames_id) as exames_id
      FROM ponto.tb_exames
      WHERE agenda_exames_id = ${attendanceId};
    `;

    await this.prisma.$queryRaw`
      INSERT INTO ponto.tb_ambulatorio_laudo (
        exame_id,
        data_cadastro,
        situacao,
        operador_cadastro,
        paciente_id,
        procedimento_tuss_id,
        medico_parecer1,
        guia_id,
        tipo
      ) VALUES (
        ${lastExam.exames_id},
        '${now.toISOString()}',
        'AGUARDANDO',
        ${operador_cadastro},
        ${paciente_id},
        ${procedimento_tuss_id},
        ${medico_realizador},
        ${guia_id},
        '${tipo}'
      );
    `;
  }
}
