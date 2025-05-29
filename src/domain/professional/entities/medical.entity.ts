import { UniqueID } from 'src/core/object-values/unique-id';
import { MedicalEntityType } from '../@types/medical';
import { CRM } from 'src/core/object-values/crm';
import { Authenticable } from 'src/core/entities/authenticable.entity';
import { Hasher } from 'src/core/cryptography/hasher';
import { Either, left, right } from '@/core/either';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { NewAccessAccount } from '../events/new-access-account.event';
import { formatName } from '@/core/utils/format-name';
import { MedicalEntityBuildError } from '@/app/use-cases/auth/errors';

export type MedicalEntityResponse = Either<MedicalEntityBuildError, Medical>;

export class Medical extends AggregateRoot<MedicalEntityType> {
  private _auth: Authenticable;

  get crm(): CRM {
    if (!this.props.crm) {
      throw new Error('CRM não encontrado para este médico.');
    }
    return this.props.crm;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  async compare(raw: string, hasher: Hasher): Promise<boolean> {
    return this._auth.compareHash(raw, hasher);
  }

  constructor(props: MedicalEntityType, auth: Authenticable, id?: UniqueID) {
    super(props, id);
    this._auth = auth;
  }

  static create(
    props: MedicalEntityType,
    id?: UniqueID,
  ): MedicalEntityResponse {
    const auth = Authenticable.create({
      password: props.password,
      email: props.email,
      username: props.username,
    });

    if (auth.isLeft()) {
      return left(new MedicalEntityBuildError());
    }

    const medical = new Medical(
      {
        ...props,
      },
      auth.value,
      id,
    );

    return right(medical);
  }

  public recordAccess(ip?: string) {
    this.addDomainEvent(
      new NewAccessAccount({
        aggregateId: this.id,
        name: formatName(this.props.name).name,
        email: this.props.email,
        ip,
      }),
    );
  }
}
