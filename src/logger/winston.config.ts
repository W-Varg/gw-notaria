// src/logger/winston.config.ts
import * as winston from 'winston';

export const winstonConfig = {
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const release = process.env.RELEASE_ID || 'unknown';
      const env = process.env.NODE_ENV || 'dev';
      const userId = meta.userId || 'system';
      return JSON.stringify({
        timestamp,
        level,
        message,
        release,
        env,
        userId,
        ...meta,
      });
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
};
