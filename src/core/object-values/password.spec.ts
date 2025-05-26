import { describe, it, expect } from 'vitest';
import { Password } from './password';
import {
  PasswordTooShortError,
  PasswordMissingUppercaseError,
  PasswordMissingSymbolError,
  PasswordSequentialNumberError,
  PasswordGenerationLengthError,
} from '../errors';

describe('Password Entity', () => {
  describe('create', () => {
    it('should create a valid password', () => {
      const result = Password.create('Valid@12');

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value.getValue()).toBe('Valid@12');
      }
    });

    it('should fail if password is too short', () => {
      const result = Password.create('Va@1');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(PasswordTooShortError);
    });

    it('should fail if missing uppercase letter', () => {
      const result = Password.create('valid@123');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(PasswordMissingUppercaseError);
    });

    it('should fail if missing symbol', () => {
      const result = Password.create('Valid123');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(PasswordMissingSymbolError);
    });

    it('should fail if contains sequential numbers (ascending)', () => {
      const result = Password.create('Valid@123');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(PasswordSequentialNumberError);
    });

    it('should fail if contains sequential numbers (descending)', () => {
      const result = Password.create('Valid@321');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(PasswordSequentialNumberError);
    });
  });

  describe('generate', () => {
    it('should generate a password with default length', () => {
      const result = Password.generate();

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value.getValue()).toHaveLength(12);
      }
    });

    it('should generate a password with custom length', () => {
      const result = Password.generate(16);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value.getValue()).toHaveLength(16);
      }
    });

    it('should fail if length is less than 6', () => {
      const result = Password.generate(4);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(PasswordGenerationLengthError);
    });
  });
});
