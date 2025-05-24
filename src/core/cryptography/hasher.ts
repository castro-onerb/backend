export abstract class Hasher {
  abstract hash(raw: string): Promise<string> | string;
  abstract compare(raw: string, hashed: string): Promise<boolean> | boolean;
}
