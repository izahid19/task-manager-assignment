import { z } from 'zod';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from '../../dtos/task.dto.js';
import { TaskPriority, TaskStatus } from '../../types/index.js';

describe('Task DTOs', () => {
  describe('createTaskSchema', () => {
    it('should validate a complete valid task', () => {
      const validTask = {
        title: 'Test Task',
        description: 'This is a test task description',
        dueDate: '2024-12-31T23:59:59Z',
        priority: 'High',
        status: 'To Do',
      };

      const result = createTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Test Task');
        expect(result.data.dueDate).toBeInstanceOf(Date);
        expect(result.data.priority).toBe(TaskPriority.HIGH);
      }
    });

    it('should reject title exceeding 100 characters', () => {
      const invalidTask = {
        title: 'A'.repeat(101),
        description: 'Description',
        dueDate: '2024-12-31',
      };

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title');
      }
    });

    it('should reject empty title', () => {
      const invalidTask = {
        title: '',
        description: 'Description',
        dueDate: '2024-12-31',
      };

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const invalidTask = {};

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path[0]);
        expect(paths).toContain('title');
        expect(paths).toContain('description');
        expect(paths).toContain('dueDate');
      }
    });

    it('should reject invalid date format', () => {
      const invalidTask = {
        title: 'Test',
        description: 'Description',
        dueDate: 'not-a-date',
      };

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should reject invalid priority enum', () => {
      const invalidTask = {
        title: 'Test',
        description: 'Description',
        dueDate: '2024-12-31',
        priority: 'VeryHigh', // Invalid enum value
      };

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should reject invalid assignedToId format', () => {
      const invalidTask = {
        title: 'Test',
        description: 'Description',
        dueDate: '2024-12-31',
        assignedToId: 'not-a-valid-objectid',
      };

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should accept valid MongoDB ObjectId for assignedToId', () => {
      const validTask = {
        title: 'Test',
        description: 'Description',
        dueDate: '2024-12-31',
        assignedToId: '507f1f77bcf86cd799439011',
      };

      const result = createTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should use default values for priority and status when not provided', () => {
      const taskWithoutDefaults = {
        title: 'Test',
        description: 'Description',
        dueDate: '2024-12-31',
      };

      const result = createTaskSchema.safeParse(taskWithoutDefaults);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priority).toBe(TaskPriority.MEDIUM);
        expect(result.data.status).toBe(TaskStatus.TODO);
      }
    });
  });

  describe('updateTaskSchema', () => {
    it('should validate partial updates', () => {
      const partialUpdate = {
        status: 'In Progress',
      };

      const result = updateTaskSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow empty object (no updates)', () => {
      const result = updateTaskSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should allow null assignedToId (to unassign)', () => {
      const update = {
        assignedToId: null,
      };

      const result = updateTaskSchema.safeParse(update);
      expect(result.success).toBe(true);
    });
  });

  describe('taskQuerySchema', () => {
    it('should use default values when no query params provided', () => {
      const result = taskQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
        expect(result.data.sortBy).toBe('createdAt');
        expect(result.data.sortOrder).toBe('desc');
      }
    });

    it('should parse string numbers to integers', () => {
      const query = {
        page: '2',
        limit: '20',
      };

      const result = taskQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(20);
      }
    });

    it('should reject page less than 1', () => {
      const query = { page: '0' };
      const result = taskQuerySchema.safeParse(query);
      expect(result.success).toBe(false);
    });

    it('should reject limit greater than 100', () => {
      const query = { limit: '101' };
      const result = taskQuerySchema.safeParse(query);
      expect(result.success).toBe(false);
    });

    it('should accept valid filter parameters', () => {
      const query = {
        status: 'In Progress',
        priority: 'High',
      };

      const result = taskQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
    });
  });
});
