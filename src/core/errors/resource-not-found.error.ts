export class ResourceNotFoundError extends Error {
  constructor(value?: string) {
    super(value ?? 'Recurso não encontrado');
  }
}
