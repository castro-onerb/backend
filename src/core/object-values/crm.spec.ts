import { describe, it, expect } from 'vitest';
import { CRM } from './crm';
import { BadRequestException } from '@nestjs/common';

describe('CRM Object Value', () => {
  it('should create a valid CRM', () => {
    const result = CRM.create('123456-SP');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.value).toBe('123456-SP');
    }
  });

  it('should fail to create CRM with invalid format', () => {
    const result = CRM.create('123456SP'); // faltando hífen

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
  });

  it('should validate CRM format correctly', () => {
    expect(CRM.isValid('1234-CE')).toBe(true);
    expect(CRM.isValid('1234567-RJ')).toBe(true);
    expect(CRM.isValid('12-RJ')).toBe(false); // muito curto
    expect(CRM.isValid('12345678-RJ')).toBe(false); // muito longo
    expect(CRM.isValid('123456-rj')).toBe(false); // estado minúsculo
    expect(CRM.isValid('abc123-SP')).toBe(false); // letras no número
  });

  it('should create from parts', () => {
    const result = CRM.fromParts('123456', 'ce');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.value).toBe('123456-CE');
    }
  });

  it('should compare two CRMs correctly', () => {
    const a = CRM.create('123456-SP');
    const b = CRM.create('123456-SP');
    const c = CRM.create('654321-SP');

    if (a.isRight() && b.isRight() && c.isRight()) {
      expect(a.value.equals(b.value)).toBe(true);
      expect(a.value.equals(c.value)).toBe(false);
    }
  });

  it('should split CRM into number and UF', () => {
    const crm = CRM.create('654321-MG');

    if (crm.isRight()) {
      const parts = crm.value.split();
      expect(parts.crm).toBe('654321');
      expect(parts.uf).toBe('MG');
    }
  });
});
