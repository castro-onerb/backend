import { UniqueID } from 'src/core/object-values/unique-id';
import { Authenticable } from 'src/core/entities/authenticable.entity';
import { Hasher } from 'src/core/cryptography/hasher';
import { Either, left, right } from '@/core/either';
import { BadRequestException } from '@nestjs/common';
import { OperatorEntityType } from '../@types/operator';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { NewAccessAccount } from '../events/new-access-account.event';

export type OperatorEntityResponse = Either<BadRequestException, Operator>;

export class Operator extends AggregateRoot<OperatorEntityType> {
  private _auth: Authenticable;

  get username(): string {
    return this._auth.username;
  }

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

  public recordAccess(ip?: string) {
    this.addDomainEvent(
      new NewAccessAccount({
        aggregateId: this.id,
        email: this.props.email,
        ip,
      }),
    );
  }
}
