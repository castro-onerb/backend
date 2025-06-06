import { SchedulingEntity } from '@/core/entities/scheduling.entity';
import { UniqueID } from '@/core/object-values/unique-id';
import { IMedicalSchedulingProps } from '../@types/medical-scheduling';

export class MedicalScheduling extends SchedulingEntity<IMedicalSchedulingProps> {
  static create(props: IMedicalSchedulingProps, id?: UniqueID) {
    return new MedicalScheduling(
      {
        ...props,
      },
      id,
    );
  }
}
