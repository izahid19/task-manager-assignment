import { taskRepository } from '../repositories/task.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { notificationRepository } from '../repositories/notification.repository.js';
import { AppError } from '../middleware/error.middleware.js';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from '../dtos/task.dto.js';
import { TaskFilters, TaskPriority, TaskStatus } from '../types/index.js';
import { ITaskDocument } from '../models/Task.js';

/**
 * Task service layer
 * Handles all business logic for task management
 */
export class TaskService {
  /**
   * Creates a new task
   * @param data - Task creation data
   * @param creatorId - ID of the user creating the task
   * @returns Created task document
   */
  async createTask(data: CreateTaskDto, creatorId: string): Promise<ITaskDocument> {
    // Validate assignee if provided
    if (data.assignedToId) {
      const assignee = await userRepository.findById(data.assignedToId);
      if (!assignee) {
        throw new AppError('Assigned user not found', 404);
      }
      if (!assignee.isVerified) {
        throw new AppError('Cannot assign task to unverified user', 400);
      }
    }

    const task = await taskRepository.create({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority || TaskPriority.MEDIUM,
      status: data.status || TaskStatus.TODO,
      creatorId,
      assignedToId: data.assignedToId,
    });

    // Create notification for assignee if assigned
    if (data.assignedToId && data.assignedToId !== creatorId) {
      await notificationRepository.create({
        userId: data.assignedToId,
        type: 'task_assigned',
        message: `You have been assigned a new task: ${task.title}`,
        taskId: task._id.toString(),
      });
    }

    // Return populated task
    return taskRepository.findById(task._id.toString()) as Promise<ITaskDocument>;
  }

  /**
   * Gets a task by ID
   * @param taskId - Task ID
   * @returns Task document
   */
  async getTaskById(taskId: string): Promise<ITaskDocument> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  /**
   * Gets tasks with filtering, sorting, and pagination
   * @param query - Query parameters
   * @returns Paginated task results
   */
  async getTasks(query: TaskQueryDto) {
    const filters: TaskFilters = {};
    
    if (query.status) {
      filters.status = query.status;
    }
    
    if (query.priority) {
      filters.priority = query.priority;
    }

    return taskRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      filters,
    });
  }

  /**
   * Updates a task
   * @param taskId - Task ID
   * @param data - Update data
   * @param userId - ID of the user updating the task
   * @returns Updated task document
   */
  async updateTask(
    taskId: string,
    data: UpdateTaskDto,
    userId: string
  ): Promise<{ task: ITaskDocument; previousAssigneeId?: string; assigneeChanged: boolean }> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Only creator can update the task
    if (task.creatorId._id.toString() !== userId) {
      throw new AppError('You are not authorized to update this task', 403);
    }

    // Validate new assignee if being changed
    if (data.assignedToId !== undefined && data.assignedToId !== null) {
      const assignee = await userRepository.findById(data.assignedToId);
      if (!assignee) {
        throw new AppError('Assigned user not found', 404);
      }
      if (!assignee.isVerified) {
        throw new AppError('Cannot assign task to unverified user', 400);
      }
    }

    const previousAssigneeId = task.assignedToId?._id?.toString();
    const assigneeChanged = data.assignedToId !== undefined && 
      data.assignedToId !== previousAssigneeId;

    const updatedTask = await taskRepository.updateById(taskId, data);
    if (!updatedTask) {
      throw new AppError('Failed to update task', 500);
    }

    // Create notification for new assignee
    if (assigneeChanged && data.assignedToId && data.assignedToId !== userId) {
      await notificationRepository.create({
        userId: data.assignedToId,
        type: 'task_assigned',
        message: `You have been assigned a task: ${updatedTask.title}`,
        taskId: updatedTask._id.toString(),
      });
    }

    return { task: updatedTask, previousAssigneeId, assigneeChanged };
  }

  /**
   * Deletes a task
   * @param taskId - Task ID
   * @param userId - ID of the user deleting the task
   * @returns Deleted task
   */
  async deleteTask(taskId: string, userId: string): Promise<ITaskDocument> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Only creator can delete the task
    if (task.creatorId._id.toString() !== userId) {
      throw new AppError('You are not authorized to delete this task', 403);
    }

    await taskRepository.deleteById(taskId);
    return task;
  }

  /**
   * Gets tasks assigned to a user
   * @param userId - User ID
   * @param query - Pagination parameters
   * @returns Paginated task results
   */
  async getAssignedTasks(userId: string, query: TaskQueryDto) {
    return taskRepository.findByAssignee(userId, {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }

  /**
   * Gets tasks created by a user
   * @param userId - User ID
   * @param query - Pagination parameters
   * @returns Paginated task results
   */
  async getCreatedTasks(userId: string, query: TaskQueryDto) {
    return taskRepository.findByCreator(userId, {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }

  /**
   * Gets overdue tasks for a user
   * @param userId - User ID
   * @param query - Pagination parameters
   * @returns Paginated task results
   */
  async getOverdueTasks(userId: string, query: TaskQueryDto) {
    return taskRepository.findOverdueForUser(userId, {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy || 'dueDate',
      sortOrder: query.sortOrder || 'asc',
    });
  }
}

export const taskService = new TaskService();
