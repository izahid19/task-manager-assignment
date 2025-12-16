import { z } from 'zod';

/**
 * Update user profile DTO schema
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .optional(),
});

// Export inferred types
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
