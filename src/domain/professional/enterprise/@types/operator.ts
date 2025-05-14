import { AuthCredentialsProps } from 'src/core/@types/auth.credentials';
import { PersonPropsBase } from 'src/core/entities/person.entity';

export type OperatorEntityType = PersonPropsBase & {} & AuthCredentialsProps;
