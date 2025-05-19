import { BadRequestException } from '@nestjs/common';
import { Either, left, right } from '../either';

export class Password {
  private readonly value: string;

  private constructor(password: string) {
    this.value = password;
  }

  public static create(
    password: string,
  ): Either<BadRequestException, Password> {
    const pwd = new Password(password);
    const validation = pwd.validate();

    if (validation.isLeft()) {
      return left(validation.value);
    }

    return right(pwd);
  }

  public static generate(length = 12): Either<BadRequestException, Password> {
    if (length < 6) {
      return left(
        new BadRequestException('A senha precisa ter ao menos 6 caracteres'),
      );
    }

    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';

    const getRandom = (chars: string) =>
      chars[Math.floor(Math.random() * chars.length)];

    const generated = [
      getRandom(upper),
      getRandom(lower),
      getRandom(symbols),
      getRandom(numbers),
    ];

    const allChars = upper + lower + numbers + symbols;

    while (generated.length < length) {
      generated.push(getRandom(allChars));
    }

    const shuffled = generated
      .map((c) => ({ char: c, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.char)
      .join('');

    const password = new Password(shuffled);
    return right(password);
  }

  private validate(): Either<BadRequestException, void> {
    if (this.value.length < 6) {
      return left(
        new BadRequestException(
          'Sua senha precisa ter pelo menos 6 caracteres.',
        ),
      );
    }

    if (!/[A-Z]/.test(this.value)) {
      return left(
        new BadRequestException(
          'Sua senha deve conter ao menos uma letra maiúscula.',
        ),
      );
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.value)) {
      return left(
        new BadRequestException('Sua senha deve conter ao menos um símbolo.'),
      );
    }

    if (this.hasSequentialNumbers().isRight()) {
      return left(
        new BadRequestException(
          'Sua senha não deve conter números sequenciais',
        ),
      );
    }

    return right(undefined);
  }

  private hasSequentialNumbers(): Either<false, true> {
    for (let i = 0; i < this.value.length - 2; i++) {
      const a = this.value.charCodeAt(i);
      const b = this.value.charCodeAt(i + 1);
      const c = this.value.charCodeAt(i + 2);

      if (this.isDigit(a) && this.isDigit(b) && this.isDigit(c)) {
        const d1 = a - 48;
        const d2 = b - 48;
        const d3 = c - 48;

        const isAscending = d2 === d1 + 1 && d3 === d2 + 1;
        const isDescending = d2 === d1 - 1 && d3 === d2 - 1;

        if (isAscending || isDescending) {
          return right(true);
        }
      }
    }
    return left(false);
  }

  private isDigit(charCode: number): boolean {
    return charCode >= 48 && charCode <= 57;
  }

  public getValue(): string {
    return this.value;
  }
}
