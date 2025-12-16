import { Request, Response, NextFunction } from 'express';
import { rateLimiters } from '../config/redis.js';

type RateLimiterType = keyof typeof rateLimiters;

/**
 * Rate limiting middleware factory
 * Uses Upstash Redis for distributed rate limiting
 * @param type - Type of rate limiter to use
 * @returns Express middleware function
 */
export const rateLimit = (type: RateLimiterType) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const identifier = req.ip || req.socket.remoteAddress || 'unknown';
      const limiter = rateLimiters[type];
      
      const { success, limit, remaining, reset } = await limiter.limit(identifier);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', limit.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader('X-RateLimit-Reset', reset.toString());

      if (!success) {
        res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        });
        return;
      }

      next();
    } catch (error) {
      // If rate limiting fails, allow the request but log the error
      console.error('Rate limiting error:', error);
      next();
    }
  };
};
