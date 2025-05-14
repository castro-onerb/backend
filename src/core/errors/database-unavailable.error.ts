export class DatabaseUnavailableError extends Error {
  constructor(message = 'Banco de dados indisponível no momento.') {
    super(message);
    this.name = 'DatabaseUnavailableError';
  }
}
