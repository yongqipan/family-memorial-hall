import { query, testConnection, closeConnection } from '../config/database';
import winston from 'winston';
import fs from 'fs';
import path from 'path';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

async function initializeDatabase(): Promise<void> {
  try {
    logger.info('Initializing database...');
    
    await testConnection();
    
    const sqlPath = path.join(__dirname, '../../migrations/001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    await query(sql);
    
    logger.info('Database initialized successfully');
    
    await closeConnection();
    
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Database initialization failed', { error });
    process.exit(1);
  }
}

initializeDatabase();
