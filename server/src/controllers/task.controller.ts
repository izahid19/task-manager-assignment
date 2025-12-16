import { Response, NextFunction, Request } from 'express';
import { taskService } from '../services/task.service.js';
import { notificationService } from '../services/notification.service.js';
import { userRepository } from '../repositories/user.repository.js';
import { AuthRequest } from '../types/index.js';
import { getIO } from '../socket/index.js';

/**
 * Task Controller
 * Handles HTTP requests for task management endpoints
 */
export class TaskController {
  /**
   * POST /api/tasks
   * Creates a new task
   */
  async createTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const task = await taskService.createTask(req.body, userId);
      
      // Emit socket event for real-time update
      const io = getIO();
      io.emit('task:created', task);

      // Send socket notification to assignee
      if (task.assignedToId && task.assignedToId._id.toString() !== userId) {
        io.to(`user:${task.assignedToId._id}`).emit('notification:assigned', {
          taskId: task._id,
          taskTitle: task.title,
          message: `You have been assigned a new task: ${task.title}`,
        });
      }
      
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks
   * Gets tasks with filtering and sorting
   */
  async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await taskService.getTasks(req.query as any);
      
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks/:id
   * Gets a single task by ID
   */
  async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await taskService.getTaskById(req.params.id);
      
      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/tasks/:id
   * Updates a task
   */
  async updateTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { task, assigneeChanged } = await taskService.updateTask(
        req.params.id,
        req.body,
        userId
      );
      
      // Emit socket event for real-time update
      const io = getIO();
      io.emit('task:updated', task);

      // Send socket notification to new assignee
      if (assigneeChanged && task.assignedToId && task.assignedToId._id.toString() !== userId) {
        const assigner = await userRepository.findById(userId);
        io.to(`user:${task.assignedToId._id}`).emit('notification:assigned', {
          taskId: task._id,
          taskTitle: task.title,
          message: `${assigner?.name || 'Someone'} assigned you a task: ${task.title}`,
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/tasks/:id
   * Deletes a task
   */
  async deleteTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const task = await taskService.deleteTask(req.params.id, userId);
      
      // Emit socket event for real-time update
      const io = getIO();
      io.emit('task:deleted', { id: req.params.id });
      
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: { id: task._id },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks/dashboard/assigned
   * Gets tasks assigned to current user
   */
  async getAssignedTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await taskService.getAssignedTasks(userId, req.query as any);
      
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks/dashboard/created
   * Gets tasks created by current user
   */
  async getCreatedTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await taskService.getCreatedTasks(userId, req.query as any);
      
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks/dashboard/overdue
   * Gets overdue tasks for current user
   */
  async getOverdueTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await taskService.getOverdueTasks(userId, req.query as any);
      
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
