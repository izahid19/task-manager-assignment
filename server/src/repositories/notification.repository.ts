import { Notification, INotificationDocument } from '../models/Notification.js';
import { Types } from 'mongoose';

/**
 * Notification repository layer
 * Handles all database operations for Notification model
 */
export class NotificationRepository {
  /**
   * Creates a new notification
   * @param data - Notification data
   * @returns Created notification document
   */
  async create(data: {
    userId: string;
    type: 'task_assigned' | 'task_updated';
    message: string;
    taskId: string;
  }): Promise<INotificationDocument> {
    const notification = new Notification({
      userId: new Types.ObjectId(data.userId),
      type: data.type,
      message: data.message,
      taskId: new Types.ObjectId(data.taskId),
    });
    return notification.save();
  }

  /**
   * Finds notifications for a user
   * @param userId - User ID
   * @param unreadOnly - If true, only returns unread notifications
   * @returns Array of notification documents
   */
  async findByUser(
    userId: string,
    unreadOnly = false
  ): Promise<INotificationDocument[]> {
    const query: Record<string, unknown> = { userId };
    if (unreadOnly) {
      query.isRead = false;
    }
    return Notification.find(query)
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .limit(50);
  }

  /**
   * Marks a notification as read
   * @param id - Notification ID
   * @returns Updated notification document or null
   */
  async markAsRead(id: string): Promise<INotificationDocument | null> {
    return Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
  }

  /**
   * Marks all notifications as read for a user
   * @param userId - User ID
   * @returns Number of updated notifications
   */
  async markAllAsRead(userId: string): Promise<number> {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    return result.modifiedCount;
  }

  /**
   * Gets unread notification count for a user
   * @param userId - User ID
   * @returns Number of unread notifications
   */
  async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({ userId, isRead: false });
  }
}

export const notificationRepository = new NotificationRepository();
