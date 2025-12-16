import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';
import { env } from '../config/env.js';

let io: Server;

/**
 * Socket.io event handlers
 */
const handleConnection = (socket: Socket): void => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Handle user authentication and room joining
  socket.on('authenticate', (token: string) => {
    const payload = verifyToken(token);
    if (payload) {
      socket.join(`user:${payload.userId}`);
      console.log(`👤 User ${payload.userId} joined their room`);
      socket.emit('authenticated', { userId: payload.userId });
    } else {
      socket.emit('authentication_error', { message: 'Invalid token' });
    }
  });

  // Handle joining a task board room (for collaborative editing)
  socket.on('join:taskboard', () => {
    socket.join('taskboard');
    console.log(`📋 Client ${socket.id} joined taskboard`);
  });

  // Handle leaving a task board room
  socket.on('leave:taskboard', () => {
    socket.leave('taskboard');
    console.log(`📋 Client ${socket.id} left taskboard`);
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`🔌 Client disconnected: ${socket.id}, Reason: ${reason}`);
  });
};

/**
 * Initializes Socket.io server
 * @param httpServer - HTTP server instance
 * @returns Socket.io server instance
 */
export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', handleConnection);

  console.log('🔌 Socket.io initialized');
  return io;
};

/**
 * Gets the Socket.io server instance
 * @returns Socket.io server instance
 * @throws Error if socket is not initialized
 */
export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

/**
 * Emits a task update event to all connected clients
 * @param event - Event name
 * @param data - Event data
 */
export const emitTaskEvent = (
  event: 'task:created' | 'task:updated' | 'task:deleted',
  data: unknown
): void => {
  if (io) {
    io.emit(event, data);
  }
};

/**
 * Sends a notification to a specific user
 * @param userId - User ID to notify
 * @param notification - Notification data
 */
export const notifyUser = (userId: string, notification: unknown): void => {
  if (io) {
    io.to(`user:${userId}`).emit('notification:assigned', notification);
  }
};
