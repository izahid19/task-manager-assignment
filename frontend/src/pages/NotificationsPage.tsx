import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/hooks';
import { api } from '@/lib/api';
import { Card, CardContent, Button, Skeleton, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

export function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const queryClient = useQueryClient();

  // GSAP refs
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  // Animate notification cards when data loads
  useEffect(() => {
    if (!isLoading && notifications && listRef.current) {
      const cards = listRef.current.querySelectorAll('.notification-card');
      gsap.fromTo(cards,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [notifications, isLoading]);

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 opacity-0">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your task assignments and updates
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
            className="gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div ref={listRef} className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))
        ) : notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification._id}
              className={cn(
                'notification-card transition-colors',
                !notification.isRead && 'bg-primary/5 border-primary/20'
              )}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div
                  className={cn(
                    'rounded-full p-2',
                    notification.type === 'task_assigned'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-green-500/10 text-green-500'
                  )}
                >
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead.mutate(notification._id)}
                        disabled={markAsRead.isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Badge variant="outline" className="mt-2">
                    {notification.type === 'task_assigned' ? 'Task Assigned' : 'Task Updated'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No notifications yet</p>
            <p className="text-sm">You'll see updates about your tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}

