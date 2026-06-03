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

/**
 * 运行 SQL 迁移文件
 */
async function runMigration(): Promise<void> {
  try {
    logger.info('Starting database migration...');
    
    // 测试数据库连接
    await testConnection();
    
    // 读取 SQL 文件
    const sqlPath = path.join(__dirname, '../../migrations/001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // 执行 SQL
    await query(sql);
    
    logger.info('Database migration completed successfully');
    
    // 关闭连接
    await closeConnection();
  } catch (error) {
    logger.error('Database migration failed', { error });
    process.exit(1);
  }
}

// 执行迁移
runMigration();
