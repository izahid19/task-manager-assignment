import { Task, ITaskDocument } from '../models/Task.js';
import { TaskFilters, TaskPriority, TaskStatus } from '../types/index.js';
import { FilterQuery, SortOrder } from 'mongoose';

interface TaskQueryOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filters?: TaskFilters;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Task repository layer
 * Handles all database operations for Task model
 */
export class TaskRepository {
  /**
   * Creates a new task
   * @param data - Task data
   * @returns Created task document
   */
  async create(data: {
    title: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
    creatorId: string;
    assignedToId?: string;
  }): Promise<ITaskDocument> {
    const task = new Task(data);
    return task.save();
  }

  /**
   * Finds a task by ID
   * @param id - Task ID
   * @returns Task document or null
   */
  async findById(id: string): Promise<ITaskDocument | null> {
    return Task.findById(id)
      .populate('creatorId', 'name email')
      .populate('assignedToId', 'name email');
  }

  /**
   * Finds tasks with pagination, sorting, and filtering
   * @param options - Query options
   * @returns Paginated task results
   */
  async findWithPagination(options: TaskQueryOptions): Promise<PaginatedResult<ITaskDocument>> {
    const { page, limit, sortBy, sortOrder, filters } = options;
    const skip = (page - 1) * limit;

    // Build filter query
    const query: FilterQuery<ITaskDocument> = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.priority) {
      query.priority = filters.priority;
    }

    if (filters?.creatorId) {
      query.creatorId = filters.creatorId;
    }

    if (filters?.assignedToId) {
      query.assignedToId = filters.assignedToId;
    }

    if (filters?.overdue) {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: TaskStatus.COMPLETED };
    }

    // Build sort object
    const sort: Record<string, SortOrder> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [data, total] = await Promise.all([
      Task.find(query)
        .populate('creatorId', 'name email')
        .populate('assignedToId', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Updates a task by ID
   * @param id - Task ID
   * @param data - Partial task data to update
   * @returns Updated task document or null
   */
  async updateById(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      dueDate: Date;
      priority: TaskPriority;
      status: TaskStatus;
      assignedToId: string | null;
    }>
  ): Promise<ITaskDocument | null> {
    return Task.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('creatorId', 'name email')
      .populate('assignedToId', 'name email');
  }

  /**
   * Deletes a task by ID
   * @param id - Task ID
   * @returns Deleted task document or null
   */
  async deleteById(id: string): Promise<ITaskDocument | null> {
    return Task.findByIdAndDelete(id);
  }

  /**
   * Finds tasks assigned to a specific user
   * @param userId - User ID
   * @param options - Pagination options
   * @returns Paginated task results
   */
  async findByAssignee(
    userId: string,
    options: Omit<TaskQueryOptions, 'filters'>
  ): Promise<PaginatedResult<ITaskDocument>> {
    return this.findWithPagination({
      ...options,
      filters: { assignedToId: userId },
    });
  }

  /**
   * Finds tasks created by a specific user
   * @param userId - User ID
   * @param options - Pagination options
   * @returns Paginated task results
   */
  async findByCreator(
    userId: string,
    options: Omit<TaskQueryOptions, 'filters'>
  ): Promise<PaginatedResult<ITaskDocument>> {
    return this.findWithPagination({
      ...options,
      filters: { creatorId: userId },
    });
  }

  /**
   * Finds overdue tasks for a specific user
   * @param userId - User ID
   * @param options - Pagination options
   * @returns Paginated task results
   */
  async findOverdueForUser(
    userId: string,
    options: Omit<TaskQueryOptions, 'filters'>
  ): Promise<PaginatedResult<ITaskDocument>> {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;

    const query: FilterQuery<ITaskDocument> = {
      $or: [{ creatorId: userId }, { assignedToId: userId }],
      dueDate: { $lt: new Date() },
      status: { $ne: TaskStatus.COMPLETED },
    };

    const sort: Record<string, SortOrder> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      Task.find(query)
        .populate('creatorId', 'name email')
        .populate('assignedToId', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Checks if a task exists
   * @param id - Task ID
   * @returns Boolean indicating if task exists
   */
  async exists(id: string): Promise<boolean> {
    const count = await Task.countDocuments({ _id: id });
    return count > 0;
  }

  /**
   * Checks if user is the creator of a task
   * @param taskId - Task ID
   * @param userId - User ID
   * @returns Boolean indicating if user is creator
   */
  async isCreator(taskId: string, userId: string): Promise<boolean> {
    const count = await Task.countDocuments({ _id: taskId, creatorId: userId });
    return count > 0;
  }
}

export const taskRepository = new TaskRepository();
