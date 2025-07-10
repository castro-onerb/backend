import { Entity } from './entity';

export interface PersonPropsBase {
  name: string;
  cpf: string;
  birth?: Date;
}

export abstract class Person<
  Props extends PersonPropsBase,
> extends Entity<Props> {}
