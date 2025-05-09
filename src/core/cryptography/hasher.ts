export interface Hasher {
  compare(raw: string, hashed: string): Promise<boolean>;
}
