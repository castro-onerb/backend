export class CRM {
  private readonly _value: string;

  get value(): string {
    return this._value;
  }

  constructor(crm: string) {
    if (!CRM.isValid(crm)) {
      throw new Error('O CRM fornecido não parece válido.');
    }

    this._value = crm;
  }

  static isValid(crm: string): boolean {
    const crmRegex = /^\d{4,7}-[A-Z]{2}$/;
    return crmRegex.test(crm);
  }

  equals(other: CRM) {
    return this._value === other.value;
  }

  static fromParts(crm: string, uf: string): CRM {
    const crmString = `${crm}-${uf.toUpperCase()}`;
    if (!CRM.isValid(crmString)) {
      throw new Error('CRM composto inválido.');
    }
    return new CRM(crmString);
  }

  split(): { crm: string; uf: string } {
    const [crm, uf] = this._value.split('-');
    return {
      crm,
      uf,
    };
  }
}
