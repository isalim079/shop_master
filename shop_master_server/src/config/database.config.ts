import mongoose from 'mongoose';
import { config } from './env.config';
import { logger } from '../shared/utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.db.uri);
    logger.info('✅ MongoDB connected');

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB error:', err);
    });

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};