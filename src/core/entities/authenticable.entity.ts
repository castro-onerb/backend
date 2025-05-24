import { BadRequestException } from '@nestjs/common';
import { AuthCredentialsProps } from '../@types/auth.credentials';
import { Hasher } from '../cryptography/hasher';
import { Either, left, right } from '../either';

type AuthenticableResponse = Either<BadRequestException, Authenticable>;

export class Authenticable {
  protected readonly _username: string;
  protected readonly _password: string;

  get password(): string {
    return this._password;
  }

  get username(): string {
    return this._username;
  }

  constructor(props: AuthCredentialsProps) {
    this._username = props.username;
    this._password = props.password;
  }

  static create(props: AuthCredentialsProps): AuthenticableResponse {
    if (!props.password) {
      return left(
        new BadRequestException(
          'Não localizamos uma senha definida para o usuário solicitado',
        ),
      );
    }

    return right(new Authenticable(props));
  }

  async compareHash(raw: string, hasher: Hasher): Promise<boolean> {
    return hasher.compare(raw, this._password);
  }
}
