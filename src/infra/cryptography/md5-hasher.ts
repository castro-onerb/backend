import { createHash } from 'node:crypto';
import { Hasher } from 'src/core/cryptography/hasher';

export class Md5Hasher implements Hasher {
  hash(raw: string): string {
    return createHash('md5').update(raw).digest('hex');
  }
  compare(raw: string, hashed: string): boolean {
    const hashRaw = this.hash(raw);
    return hashRaw === hashed;
  }
}
