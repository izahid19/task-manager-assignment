import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from '../../dtos/auth.dto.js';

describe('Auth DTOs', () => {
  describe('registerSchema', () => {
    it('should validate a complete valid registration', () => {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePass123',
        name: 'John Doe',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.name).toBe('John Doe');
      }
    });

    it('should convert email to lowercase', () => {
      const data = {
        email: 'TEST@EXAMPLE.COM',
        password: 'SecurePass123',
        name: 'John',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'SecurePass123',
        name: 'John',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Short1',
        name: 'John',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject password without uppercase letter', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'lowercase123',
        name: 'John',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject password without lowercase letter', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'UPPERCASE123',
        name: 'John',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject password without number', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'NoNumbersHere',
        name: 'John',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject name shorter than 2 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'SecurePass123',
        name: 'J',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 100 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'SecurePass123',
        name: 'A'.repeat(101),
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should trim whitespace from name', () => {
      const data = {
        email: 'test@example.com',
        password: 'SecurePass123',
        name: '  John Doe  ',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John Doe');
      }
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login credentials', () => {
      const valid = {
        email: 'test@example.com',
        password: 'anypassword',
      };

      const result = loginSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const invalid = { password: 'test' };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalid = { email: 'test@example.com' };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('verifyOtpSchema', () => {
    it('should validate correct OTP format', () => {
      const valid = {
        email: 'test@example.com',
        otp: '123456',
      };

      const result = verifyOtpSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject OTP with non-digit characters', () => {
      const invalid = {
        email: 'test@example.com',
        otp: '12345a',
      };

      const result = verifyOtpSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject OTP with wrong length', () => {
      const invalid = {
        email: 'test@example.com',
        otp: '12345', // Only 5 digits
      };

      const result = verifyOtpSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should validate complete reset password data', () => {
      const valid = {
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'NewSecure123',
      };

      const result = resetPasswordSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject weak new password', () => {
      const invalid = {
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'weak', // Too short, no uppercase, no number
      };

      const result = resetPasswordSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
