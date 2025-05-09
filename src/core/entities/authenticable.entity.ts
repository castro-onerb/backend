import { AuthCredentialsProps } from '../@types/auth.credentials';
import { Hasher } from '../cryptography/hasher';

export class Authenticable {
  protected readonly _password: string;

  get password(): string {
    return this._password;
  }

  constructor(props: AuthCredentialsProps) {
    this._password = props.password;
  }

  async compareHash(raw: string, hasher: Hasher): Promise<boolean> {
    return hasher.compare(raw, this._password);
  }
}
