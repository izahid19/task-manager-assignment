import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/**
 * Environment variables schema validation using Zod
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_DB_URL: z.string().min(1, 'MongoDB URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BREVO_API_KEY: z.string().min(1, 'Brevo API key is required'),
  FROM_EMAIL: z.string().email('Invalid FROM_EMAIL'),
  FROM_NAME: z.string().min(1, 'FROM_NAME is required'),
  UPSTASH_REDIS_REST_URL: z.string().url('Invalid Upstash Redis URL'),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'Upstash Redis token is required'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
