import crypto from 'crypto';

/**
 * Generates a 6-digit OTP (One-Time Password)
 * Uses crypto.randomInt for cryptographically secure random numbers
 * @returns A 6-digit OTP string
 */
export const generateOtp = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generates OTP expiry time (10 minutes from now)
 * @returns Date object representing OTP expiry time
 */
export const generateOtpExpiry = (): Date => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

/**
 * Checks if an OTP has expired
 * @param expiryDate - The OTP expiry date
 * @returns Boolean indicating if OTP is expired
 */
export const isOtpExpired = (expiryDate: Date): boolean => {
  return new Date() > expiryDate;
};
