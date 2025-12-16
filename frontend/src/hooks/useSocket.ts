import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { taskKeys } from './useTasks';
import type { Task } from '@/types';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    // Connect to Socket.io server
    socketRef.current = io(window.location.origin, {
      withCredentials: true,
      transports: ['polling', 'websocket'], // Start with polling, upgrade to ws
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('🔌 Connected to Socket.io');
      setIsConnected(true);
      socket.emit('join:taskboard');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from Socket.io');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.log('🔌 Socket connection error:', error.message);
    });

    // Handle task events
    socket.on('task:created', (_task: Task) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    });

    socket.on('task:updated', (task: Task) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.setQueryData(taskKeys.detail(task._id), task);
    });

    socket.on('task:deleted', (_data: { id: string }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    });

    // Handle notifications
    socket.on('notification:assigned', (_notification: unknown) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });
  }, [queryClient]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('leave:taskboard');
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const authenticate = useCallback((token: string) => {
    if (socketRef.current) {
      socketRef.current.emit('authenticate', token);
    }
  }, []);

  return { socket: socketRef.current, isConnected, connect, disconnect, authenticate };
}

