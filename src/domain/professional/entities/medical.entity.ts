import { UniqueID } from 'src/core/object-values/unique-id';
import { Person } from 'src/core/entities/person.entity';
import { MedicalEntityType } from '../@types/medical';
import { CRM } from 'src/core/object-values/crm';
import { Authenticable } from 'src/core/entities/authenticable.entity';
import { Hasher } from 'src/core/cryptography/hasher';
import { Either, left, right } from '@/core/either';
import { BadRequestException } from '@nestjs/common';

export type MedicalEntityResponse = Either<BadRequestException, Medical>;

export class Medical extends Person<MedicalEntityType> {
  private _auth: Authenticable;

  get crm(): CRM {
    if (!this.props.crm) {
      throw new Error('CRM não encontrado para este médico.');
    }
    return this.props.crm;
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
      return left(auth.value);
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

  toObject() {
    return {
      id: this.id.toString(),
      name: this.props.name,
      email: this.props.email,
      crm: this.props.crm.value,
    };
  }
}
