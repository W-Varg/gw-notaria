import { HttpException } from '@nestjs/common';
import { paramTypeValidator } from './validator.functions';

describe('Validator Functions', () => {
  describe('paramTypeValidator', () => {
    it('should return undefined for undefined value', () => {
      const result = paramTypeValidator(undefined, () => 'string');
      expect(result).toBeUndefined();
    });

    it('should return null for null value', () => {
      const result = paramTypeValidator(null, () => 'string');
      expect(result).toBeNull();
    });

    it('should convert string to string', () => {
      const result = paramTypeValidator('test', () => 'string');
      expect(result).toBe('test');
    });

    it('should convert "true" to boolean true', () => {
      const result = paramTypeValidator('true', () => true);
      expect(result).toBe(true);
    });

    it('should convert "false" to boolean false', () => {
      const result = paramTypeValidator('false', () => false);
      expect(result).toBe(false);
    });

    it('should throw HttpException for invalid boolean', () => {
      expect(() => paramTypeValidator('invalid', () => true)).toThrow(HttpException);
    });

    it('should convert valid number string to number', () => {
      const result = paramTypeValidator('123', () => 0);
      expect(result).toBe(123);
    });

    it('should throw HttpException for invalid number', () => {
      expect(() => paramTypeValidator('abc', () => 0)).toThrow(HttpException);
    });

    it('should return object as is', () => {
      const obj = '{"key": "value"}';
      const result = paramTypeValidator(obj, () => ({}));
      expect(result).toBe(obj);
    });
  });
});
