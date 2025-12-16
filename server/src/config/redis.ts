import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { env } from './env.js';

/**
 * Upstash Redis client for rate limiting and OTP storage
 */
export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

/** OTP expiry time in seconds (10 minutes) */
const OTP_EXPIRY_SECONDS = 10 * 60;

/**
 * Store verification OTP in Redis
 * @param email - User email
 * @param otp - OTP code
 */
export async function storeVerificationOtp(email: string, otp: string): Promise<void> {
  const key = `otp:verify:${email.toLowerCase()}`;
  await redis.set(key, otp, { ex: OTP_EXPIRY_SECONDS });
}

/**
 * Get verification OTP from Redis
 * @param email - User email
 * @returns OTP code or null if not found/expired
 */
export async function getVerificationOtp(email: string): Promise<string | null> {
  const key = `otp:verify:${email.toLowerCase()}`;
  return await redis.get<string>(key);
}

/**
 * Delete verification OTP from Redis
 * @param email - User email
 */
export async function deleteVerificationOtp(email: string): Promise<void> {
  const key = `otp:verify:${email.toLowerCase()}`;
  await redis.del(key);
}

/**
 * Store password reset OTP in Redis
 * @param email - User email
 * @param otp - OTP code
 */
export async function storeResetOtp(email: string, otp: string): Promise<void> {
  const key = `otp:reset:${email.toLowerCase()}`;
  await redis.set(key, otp, { ex: OTP_EXPIRY_SECONDS });
}

/**
 * Get password reset OTP from Redis
 * @param email - User email
 * @returns OTP code or null if not found/expired
 */
export async function getResetOtp(email: string): Promise<string | null> {
  const key = `otp:reset:${email.toLowerCase()}`;
  return await redis.get<string>(key);
}

/**
 * Delete password reset OTP from Redis
 * @param email - User email
 */
export async function deleteResetOtp(email: string): Promise<void> {
  const key = `otp:reset:${email.toLowerCase()}`;
  await redis.del(key);
}

/**
 * Rate limiter configurations for different endpoints
 * Uses sliding window algorithm for smooth rate limiting
 */
export const rateLimiters = {
  /** Registration: 5 requests per hour */
  register: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: true,
    prefix: 'ratelimit:register',
  }),

  /** OTP verification: 10 requests per hour */
  verifyOtp: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    analytics: true,
    prefix: 'ratelimit:verify-otp',
  }),

  /** Resend OTP: 3 requests per hour */
  resendOtp: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    analytics: true,
    prefix: 'ratelimit:resend-otp',
  }),

  /** Login: 10 requests per hour */
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    analytics: true,
    prefix: 'ratelimit:login',
  }),

  /** Forgot password: 5 requests per hour */
  forgotPassword: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: true,
    prefix: 'ratelimit:forgot-password',
  }),

  /** Reset password: 5 requests per hour */
  resetPassword: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: true,
    prefix: 'ratelimit:reset-password',
  }),
};

