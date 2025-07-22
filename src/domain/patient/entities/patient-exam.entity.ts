import { Entity } from '@/core/entities/entity';
import { UniqueID } from '@/core/object-values/unique-id';
import { IPatientExamProps } from '../@types/patient-exam';

export class PatientExam extends Entity<IPatientExamProps> {
  constructor(props: IPatientExamProps, id?: UniqueID) {
    super(props, id);
  }

  static create(props: IPatientExamProps, id?: UniqueID) {
    const patientExam = new PatientExam(
      {
        ...props,
      },
      id,
    );

    return patientExam;
  }
}
