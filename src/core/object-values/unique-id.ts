import { randomUUID } from 'node:crypto';

export class UniqueID {
  private value: string;

  toString(): string {
    return this.value;
  }

  toValue() {
    return this.value;
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  equals(id: UniqueID) {
    return this.toValue() === id.toValue();
  }
}
