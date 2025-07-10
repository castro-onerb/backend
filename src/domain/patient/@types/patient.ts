import { PersonPropsBase } from '@/core/entities/person.entity';

export interface IPatientProps extends PersonPropsBase {
  active: boolean;
}
