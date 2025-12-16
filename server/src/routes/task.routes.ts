import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  taskIdSchema,
} from '../dtos/task.dto.js';

const router = Router();

// All task routes require authentication
router.use(authenticate);

/**
 * @route GET /api/tasks/dashboard/assigned
 * @desc Get tasks assigned to current user
 * @access Private
 */
router.get(
  '/dashboard/assigned',
  validate(taskQuerySchema, 'query'),
  taskController.getAssignedTasks.bind(taskController) as any
);

/**
 * @route GET /api/tasks/dashboard/created
 * @desc Get tasks created by current user
 * @access Private
 */
router.get(
  '/dashboard/created',
  validate(taskQuerySchema, 'query'),
  taskController.getCreatedTasks.bind(taskController) as any
);

/**
 * @route GET /api/tasks/dashboard/overdue
 * @desc Get overdue tasks for current user
 * @access Private
 */
router.get(
  '/dashboard/overdue',
  validate(taskQuerySchema, 'query'),
  taskController.getOverdueTasks.bind(taskController) as any
);

/**
 * @route POST /api/tasks
 * @desc Create a new task
 * @access Private
 */
router.post(
  '/',
  validate(createTaskSchema),
  taskController.createTask.bind(taskController) as any
);

/**
 * @route GET /api/tasks
 * @desc Get all tasks with filtering and pagination
 * @access Private
 */
router.get(
  '/',
  validate(taskQuerySchema, 'query'),
  taskController.getTasks.bind(taskController)
);

/**
 * @route GET /api/tasks/:id
 * @desc Get a single task by ID
 * @access Private
 */
router.get(
  '/:id',
  validate(taskIdSchema, 'params'),
  taskController.getTaskById.bind(taskController)
);

/**
 * @route PATCH /api/tasks/:id
 * @desc Update a task
 * @access Private (Creator only)
 */
router.patch(
  '/:id',
  validate(taskIdSchema, 'params'),
  validate(updateTaskSchema),
  taskController.updateTask.bind(taskController) as any
);

/**
 * @route DELETE /api/tasks/:id
 * @desc Delete a task
 * @access Private (Creator only)
 */
router.delete(
  '/:id',
  validate(taskIdSchema, 'params'),
  taskController.deleteTask.bind(taskController) as any
);

export default router;
