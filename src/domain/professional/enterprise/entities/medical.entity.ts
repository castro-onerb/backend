import { UniqueID } from 'src/core/object-values/unique-id';
import { Person } from 'src/core/entities/person.entity';
import { MedicalEntityType } from '../@types/medical';

export type MedicalEntityResponse = {
  medical: Medical;
};

export class Medical extends Person<MedicalEntityType> {
  static create(
    props: MedicalEntityType,
    id?: UniqueID,
  ): MedicalEntityResponse {
    const medical = new Medical(
      {
        ...props,
      },
      id,
    );

    return {
      medical,
    };
  }
}
