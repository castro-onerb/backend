import { compare, hash as bcryptHash } from 'bcryptjs';
import { Hasher } from 'src/core/cryptography/hasher';

export class BcryptHasher implements Hasher {
  async hash(raw: string): Promise<string> {
    return bcryptHash(raw, 8);
  }

  async compare(raw: string, hashed: string): Promise<boolean> {
    return compare(raw, hashed);
  }
}
