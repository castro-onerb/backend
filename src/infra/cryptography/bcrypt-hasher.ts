import { compare } from 'bcryptjs';
import { Hasher } from 'src/core/cryptography/hasher';

export class BcryptHasher implements Hasher {
  async compare(raw: string, hashed: string): Promise<boolean> {
    return compare(raw, hashed);
  }
}
