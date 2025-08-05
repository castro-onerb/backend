import { UniqueID } from 'src/core/object-values/unique-id';
import { Authenticable } from 'src/core/entities/authenticable.entity';
import { Hasher } from 'src/core/cryptography/hasher';
import { Either, left, right } from '@/core/either';
import { OperatorEntityType } from '../@types/operator';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { NewAccessAccount } from '../events/new-access-account.event';
import { formatName } from '@/core/utils/format-name';
import { OperatorEntityBuildError } from '@/app/use-cases/auth/errors/operators.errors';

export type OperatorEntityResponse = Either<OperatorEntityBuildError, Operator>;

export class Operator extends AggregateRoot<OperatorEntityType> {
  private _auth: Authenticable;

  get name(): string {
    return this.props.name;
  }

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
      return left(new OperatorEntityBuildError());
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

  public recordAccess(sessionId: string, ip?: string) {
    this.addDomainEvent(
      new NewAccessAccount({
        aggregateId: this.id,
        name: formatName(this.props.name).name,
        email: this.props.email,
        ip,
        sessionId,
      }),
    );
  }
}
