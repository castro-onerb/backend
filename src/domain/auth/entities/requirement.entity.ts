import { Entity } from '@/core/entities/entity';
import { UniqueID } from '@/core/object-values/unique-id';

export interface RequirementProps {
  name: string;
  satisfied: boolean;
}

export class Requirement extends Entity<RequirementProps> {
  get name() {
    return this.props.name;
  }

  get satisfied() {
    return this.props.satisfied;
  }

  static create(props: RequirementProps, id?: UniqueID) {
    return new Requirement(props, id);
  }
}
