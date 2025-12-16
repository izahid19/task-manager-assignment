import { createServer } from 'http';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { initializeSocket } from './socket/index.js';
import { env } from './config/env.js';

/**
 * Starts the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.io
    initializeSocket(httpServer);

    // Start listening
    httpServer.listen(env.PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Task Manager API Server                              ║
║                                                           ║
║   Server running on:  http://localhost:${env.PORT}             ║
║   Environment:        ${env.NODE_ENV.padEnd(29)}║
║   MongoDB:            Connected                           ║
║   Socket.io:          Ready                               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      httpServer.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
