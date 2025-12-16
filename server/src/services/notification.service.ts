import { notificationRepository } from '../repositories/notification.repository.js';
import { emailService } from './email.service.js';
import { userRepository } from '../repositories/user.repository.js';
import { ITaskDocument } from '../models/Task.js';

/**
 * Notification service layer
 * Handles business logic for notifications
 */
export class NotificationService {
  /**
   * Creates a task assignment notification
   * @param assigneeId - ID of the user being assigned
   * @param task - Task being assigned
   * @param assignerName - Name of the user assigning the task
   */
  async notifyTaskAssignment(
    assigneeId: string,
    task: ITaskDocument,
    assignerName: string
  ): Promise<void> {
    // Create in-app notification
    await notificationRepository.create({
      userId: assigneeId,
      type: 'task_assigned',
      message: `${assignerName} assigned you a task: ${task.title}`,
      taskId: task._id.toString(),
    });

    // Send email notification
    const assignee = await userRepository.findById(assigneeId);
    if (assignee) {
      await emailService.sendTaskAssignmentEmail(
        assignee.email,
        assignee.name,
        task.title,
        assignerName
      );
    }
  }

  /**
   * Gets notifications for a user
   * @param userId - User ID
   * @param unreadOnly - If true, only returns unread notifications
   * @returns Array of notifications
   */
  async getUserNotifications(userId: string, unreadOnly = false) {
    return notificationRepository.findByUser(userId, unreadOnly);
  }

  /**
   * Marks a notification as read
   * @param notificationId - Notification ID
   */
  async markAsRead(notificationId: string) {
    return notificationRepository.markAsRead(notificationId);
  }

  /**
   * Marks all notifications as read for a user
   * @param userId - User ID
   * @returns Number of updated notifications
   */
  async markAllAsRead(userId: string) {
    return notificationRepository.markAllAsRead(userId);
  }

  /**
   * Gets unread notification count
   * @param userId - User ID
   * @returns Count of unread notifications
   */
  async getUnreadCount(userId: string) {
    return notificationRepository.getUnreadCount(userId);
  }
}

export const notificationService = new NotificationService();
