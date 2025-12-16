import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Establishes connection to MongoDB database
 * Uses connection string from environment variables
 * Implements connection event handlers for logging
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    await mongoose.connect(env.MONGO_DB_URL);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

/**
 * Gracefully closes the MongoDB connection
 */
export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close();
};
