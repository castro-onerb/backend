import { Either, left, right } from '../either';
import { CpfNotValid } from '../errors';

export class CPF {
  private readonly _value: string;

  get value(): string {
    return this._value;
  }

  private constructor(value: string) {
    this._value = value;
  }

  private static sanitize(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  static isValid(cpf: string): boolean {
    const cleanCpf = this.sanitize(cpf);
    if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) {
      return false;
    }

    const calcChecker = (base: string, factor: number) => {
      let total = 0;
      for (const digit of base) {
        total += parseInt(digit, 10) * factor--;
      }
      const rest = total % 11;
      return rest < 2 ? 0 : 11 - rest;
    };

    const firstChecker = calcChecker(cleanCpf.slice(0, 9), 10);
    const secondChecker = calcChecker(cleanCpf.slice(0, 10), 11);

    return (
      firstChecker === parseInt(cleanCpf[9], 10) &&
      secondChecker === parseInt(cleanCpf[10], 10)
    );
  }

  static create(cpf: string): Either<CpfNotValid, CPF> {
    const cleanCpf = this.sanitize(cpf);
    if (!this.isValid(cleanCpf)) {
      return left(new CpfNotValid());
    }
    return right(new CPF(cleanCpf));
  }
}
