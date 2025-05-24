export class AppError extends Error {
  public readonly code: string;

  constructor(message: string, options: { code: string }) {
    super(message);
    this.name = this.constructor.name;
    this.code = options.code;

    // Garante que instanceof funcione corretamente
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
