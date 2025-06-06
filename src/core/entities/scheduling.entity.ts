import { SchedulingProps } from '../@types/scheduling';
import { Entity } from './entity';

export abstract class SchedulingEntity<
  Props extends SchedulingProps,
> extends Entity<Props> {}
