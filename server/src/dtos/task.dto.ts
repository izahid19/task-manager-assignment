import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../types/index.js';

/**
 * Create task DTO schema
 * Validates task creation input
 */
export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters')
    .trim(),
  description: z
    .string({ required_error: 'Description is required' })
    .min(1, 'Description is required')
    .trim(),
  dueDate: z
    .string({ required_error: 'Due date is required' })
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format')
    .transform((date) => new Date(date)),
  priority: z
    .nativeEnum(TaskPriority, {
      errorMap: () => ({ message: 'Priority must be one of: Low, Medium, High, Urgent' }),
    })
    .default(TaskPriority.MEDIUM),
  status: z
    .nativeEnum(TaskStatus, {
      errorMap: () => ({ message: 'Status must be one of: To Do, In Progress, Review, Completed' }),
    })
    .default(TaskStatus.TODO),
  assignedToId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
    .optional(),
});

/**
 * Update task DTO schema
 * All fields optional for partial updates
 */
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title cannot exceed 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .min(1, 'Description cannot be empty')
    .trim()
    .optional(),
  dueDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format')
    .transform((date) => new Date(date))
    .optional(),
  priority: z
    .nativeEnum(TaskPriority, {
      errorMap: () => ({ message: 'Priority must be one of: Low, Medium, High, Urgent' }),
    })
    .optional(),
  status: z
    .nativeEnum(TaskStatus, {
      errorMap: () => ({ message: 'Status must be one of: To Do, In Progress, Review, Completed' }),
    })
    .optional(),
  assignedToId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
    .nullable()
    .optional(),
});

/**
 * Task query parameters DTO schema
 * For filtering and sorting tasks
 */
export const taskQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1, 'Page must be at least 1'))
    .default('1'),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(100, 'Limit cannot exceed 100'))
    .default('10'),
  sortBy: z
    .enum(['dueDate', 'createdAt', 'priority', 'status', 'title'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
});

/**
 * Task ID parameter schema
 */
export const taskIdSchema = z.object({
  id: z
    .string({ required_error: 'Task ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID format'),
});

// Export inferred types
export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type TaskQueryDto = z.infer<typeof taskQuerySchema>;
export type TaskIdDto = z.infer<typeof taskIdSchema>;
