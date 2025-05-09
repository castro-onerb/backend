import { PersonPropsBase } from 'src/core/entities/person.entity';

export type MedicalEntityType = PersonPropsBase & {
  crm: string;
};
