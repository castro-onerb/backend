export interface Hasher {
  hash(raw: string): Promise<string> | string;
  compare(raw: string, hashed: string): Promise<boolean> | boolean;
}
