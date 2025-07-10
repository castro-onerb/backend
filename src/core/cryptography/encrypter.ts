export abstract class Encrypter {
  abstract encrypt(value: string): string;
  abstract decrypt(value: string): string;
}
