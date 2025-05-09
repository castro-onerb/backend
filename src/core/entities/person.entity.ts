import { Entity } from './entity';

export interface PersonPropsBase {
  name: string;
  cpf: number;
}

export abstract class Person<
  Props extends PersonPropsBase,
> extends Entity<Props> {}
