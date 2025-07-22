import { Entity } from '@/core/entities/entity';
import { UniqueID } from '@/core/object-values/unique-id';
import { IExamProps } from '../@types/exam';

export class Exam extends Entity<IExamProps> {
  constructor(props: IExamProps, id?: UniqueID) {
    super(props, id);
  }

  static create(props: IExamProps, id?: UniqueID) {
    const exam = new Exam(
      {
        ...props,
      },
      id,
    );

    return exam;
  }
}
