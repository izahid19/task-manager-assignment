import { generateOtp, generateOtpExpiry, isOtpExpired } from '../../utils/otp.js';

describe('OTP Utilities', () => {
  describe('generateOtp', () => {
    it('should generate a 6-digit OTP', () => {
      const otp = generateOtp();
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('should generate different OTPs on successive calls', () => {
      const otp1 = generateOtp();
      const otp2 = generateOtp();
      // While there's a small chance they could be the same, 
      // running multiple times should generally produce different results
      const otps = new Set([generateOtp(), generateOtp(), generateOtp(), generateOtp(), generateOtp()]);
      expect(otps.size).toBeGreaterThan(1);
    });

    it('should generate OTPs within valid range (100000-999999)', () => {
      for (let i = 0; i < 100; i++) {
        const otp = parseInt(generateOtp(), 10);
        expect(otp).toBeGreaterThanOrEqual(100000);
        expect(otp).toBeLessThanOrEqual(999999);
      }
    });
  });

  describe('generateOtpExpiry', () => {
    it('should return a Date object', () => {
      const expiry = generateOtpExpiry();
      expect(expiry).toBeInstanceOf(Date);
    });

    it('should return a date approximately 10 minutes in the future', () => {
      const before = Date.now();
      const expiry = generateOtpExpiry();
      const after = Date.now();

      // Expiry should be 10 minutes (600000ms) from now, with some tolerance
      const expectedMin = before + 10 * 60 * 1000;
      const expectedMax = after + 10 * 60 * 1000;

      expect(expiry.getTime()).toBeGreaterThanOrEqual(expectedMin);
      expect(expiry.getTime()).toBeLessThanOrEqual(expectedMax);
    });
  });

  describe('isOtpExpired', () => {
    it('should return false for a future date', () => {
      const futureDate = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in future
      expect(isOtpExpired(futureDate)).toBe(false);
    });

    it('should return true for a past date', () => {
      const pastDate = new Date(Date.now() - 1000); // 1 second in past
      expect(isOtpExpired(pastDate)).toBe(true);
    });

    it('should correctly handle edge case near current time', () => {
      const slightlyPast = new Date(Date.now() - 100);
      expect(isOtpExpired(slightlyPast)).toBe(true);
    });
  });
});
