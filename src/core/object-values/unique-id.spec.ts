import { describe, it, expect } from 'vitest';
import { UniqueID } from './unique-id';

describe('UniqueID', () => {
  it('should create a UniqueID with a provided value', () => {
    const id = new UniqueID('abc-123');

    expect(id.toString()).toBe('abc-123');
    expect(id.toValue()).toBe('abc-123');
  });

  it('should generate a new UUID when value is not provided', () => {
    const id = new UniqueID();

    expect(typeof id.toString()).toBe('string');
    expect(id.toString()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should consider two UniqueIDs equal if they have the same value', () => {
    const a = new UniqueID('same-id');
    const b = new UniqueID('same-id');

    expect(a.equals(b)).toBe(true);
  });

  it('should consider two UniqueIDs different if values differ', () => {
    const a = new UniqueID('id-1');
    const b = new UniqueID('id-2');

    expect(a.equals(b)).toBe(false);
  });
});
