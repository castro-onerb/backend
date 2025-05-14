import { UniqueID } from 'src/core/object-values/unique-id';
import { Person } from 'src/core/entities/person.entity';
import { Authenticable } from 'src/core/entities/authenticable.entity';
import { Hasher } from 'src/core/cryptography/hasher';
import { Either, left, right } from '@/core/either';
import { BadRequestException } from '@nestjs/common';
import { OperatorEntityType } from '../@types/operator';

export type OperatorEntityResponse = Either<BadRequestException, Operator>;

export class Operator extends Person<OperatorEntityType> {
  private _auth: Authenticable;

  async compare(raw: string, hasher: Hasher): Promise<boolean> {
    return this._auth.compareHash(raw, hasher);
  }

  constructor(props: OperatorEntityType, auth: Authenticable, id?: UniqueID) {
    super(props, id);
    this._auth = auth;
  }

  static create(
    props: OperatorEntityType,
    id?: UniqueID,
  ): OperatorEntityResponse {
    const auth = Authenticable.create({
      password: props.password,
      email: props.email,
      username: props.username,
    });

    if (auth.isLeft()) {
      return left(auth.value);
    }

    const operator = new Operator(
      {
        ...props,
      },
      auth.value,
      id,
    );

    return right(operator);
  }

  toObject() {
    return {
      id: this.id.toString(),
      name: this.props.name,
      username: this.props.username,
      email: this.props.email,
    };
  }
}
