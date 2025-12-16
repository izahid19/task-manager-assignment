/**
 * Task priority levels
 */
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

/**
 * Task status values
 */
export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Completed';

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Task interface
 */
export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: User | string;
  assignedToId?: User | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Notification interface
 */
export interface Notification {
  _id: string;
  userId: string;
  type: 'task_assigned' | 'task_updated';
  message: string;
  taskId: Task | string;
  isRead: boolean;
  createdAt: string;
}

/**
 * Auth response data
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

/**
 * Task form data
 */
export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status?: TaskStatus;
  assignedToId?: string;
}

/**
 * Task filter parameters
 */
export interface TaskFilters {
  page?: number;
  limit?: number;
  sortBy?: 'dueDate' | 'createdAt' | 'priority' | 'status' | 'title';
  sortOrder?: 'asc' | 'desc';
  status?: TaskStatus;
  priority?: TaskPriority;
}
