import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { User, Notification } from '@/types';

/** Fetch all verified users for task assignment */
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data.data as User[];
    },
  });
}

/** Fetch notifications for current user */
export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: ['notifications', { unreadOnly }],
    queryFn: async () => {
      const response = await api.get(`/notifications${unreadOnly ? '?unreadOnly=true' : ''}`);
      return response.data.data as Notification[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/** Fetch unread notification count */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'count'],
    queryFn: async () => {
      const response = await api.get('/notifications/unread-count');
      return response.data.data.count as number;
    },
    refetchInterval: 30000,
  });
}
