import { Person } from '@/core/entities/person.entity';
import { IPatientProps } from '../@types/patient';
import { UniqueID } from '@/core/object-values/unique-id';

export class Patient extends Person<IPatientProps> {
  constructor(props: IPatientProps, id?: UniqueID) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  static create(props: IPatientProps, id?: UniqueID) {
    const patient = new Patient(
      {
        ...props,
      },
      id,
    );

    return patient;
  }
}
