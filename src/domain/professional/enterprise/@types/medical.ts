import { AuthCredentialsProps } from 'src/core/@types/auth.credentials';
import { PersonPropsBase } from 'src/core/entities/person.entity';
import { CRM } from 'src/core/object-values/crm';

export type MedicalEntityType = PersonPropsBase & {
  crm: CRM;
} & AuthCredentialsProps;
