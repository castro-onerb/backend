import { Global, Module } from '@nestjs/common';
import { PrismaClinicasService } from './prisma/clinicas/prisma-clinicas.service';
import { PrismaMedicalRepository } from './prisma/clinicas/repositories/medical.repository';
import { PrismaService } from './prisma/prisma.service';
import { MedicalRepository } from '@/app/repositories/medical.repository';
import { OperatorRepository } from '@/app/repositories/operator.repository';
import { PrismaOperatorRepository } from './prisma/clinicas/repositories/operator.repository';
import { RecoveryPasswordRepository } from '@/app/repositories/recovery-password.repository';
import { PrismaRecoveryPasswordRepository } from './prisma/repositories/recovery-password.repository';
import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import { PrismaMedicalSchedulerRepository } from './prisma/clinicas/repositories/medical-scheduler.repository';
import { PatientRepository } from '@/app/repositories/patient.repository';
import { PrismaPatientRepository } from './prisma/clinicas/repositories/patient.repository';
import { PatientExamRepository } from '@/app/repositories/patient-exam.repository';
import { PrismaPatientExamsRepository } from './prisma/clinicas/repositories/patient-exams.repository';
import { AssessmentRepository } from '@/app/repositories/assessment.repository';
import { PrismaAssessmentRepository } from './prisma/clinicas/repositories/assessment.repository';
import { AttendanceRepository } from '@/app/repositories/attendance.repository';
import { PrismaAttendanceRepository } from './prisma/clinicas/repositories/attendance.repository';
import { RequirementsRepository } from '@/app/repositories/requirements.repository';
import { PrismaRequirementsRepository } from './prisma/repositories/requirements.repository';

@Global()
@Module({
  providers: [
    PrismaClinicasService,
    PrismaService,
    {
      provide: MedicalRepository,
      useClass: PrismaMedicalRepository,
    },
    {
      provide: MedicalSchedulerRepository,
      useClass: PrismaMedicalSchedulerRepository,
    },
    {
      provide: PatientExamRepository,
      useClass: PrismaPatientExamsRepository,
    },
    {
      provide: AssessmentRepository,
      useClass: PrismaAssessmentRepository,
    },
    {
      provide: OperatorRepository,
      useClass: PrismaOperatorRepository,
    },
    {
      provide: PatientRepository,
      useClass: PrismaPatientRepository,
    },
    {
      provide: RecoveryPasswordRepository,
      useClass: PrismaRecoveryPasswordRepository,
    },
    {
      provide: AttendanceRepository,
      useClass: PrismaAttendanceRepository,
    },
    {
      provide: RequirementsRepository,
      useClass: PrismaRequirementsRepository,
    },
  ],
  exports: [
    PrismaClinicasService,
    PrismaService,
    {
      provide: MedicalRepository,
      useClass: PrismaMedicalRepository,
    },
    {
      provide: MedicalSchedulerRepository,
      useClass: PrismaMedicalSchedulerRepository,
    },
    {
      provide: PatientExamRepository,
      useClass: PrismaPatientExamsRepository,
    },
    {
      provide: AssessmentRepository,
      useClass: PrismaAssessmentRepository,
    },
    {
      provide: OperatorRepository,
      useClass: PrismaOperatorRepository,
    },
    {
      provide: PatientRepository,
      useClass: PrismaPatientRepository,
    },
    {
      provide: RecoveryPasswordRepository,
      useClass: PrismaRecoveryPasswordRepository,
    },
    {
      provide: AttendanceRepository,
      useClass: PrismaAttendanceRepository,
    },
    {
      provide: RequirementsRepository,
      useClass: PrismaRequirementsRepository,
    },
  ],
})
export class DatabaseModule {}
