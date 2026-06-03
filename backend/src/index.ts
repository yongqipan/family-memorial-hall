import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import config from './config';
import { testConnection as testDatabaseConnection } from './config/database';
import { testConnection as testRedisConnection } from './config/redis';
import { ensureBucketExists } from './config/minio';
import winston from 'winston';
import authRouter from './routes/auth.routes';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

async function bootstrap() {
  const app = express();
  
  // 中间件
  app.use(helmet());
  app.use(cors({
    origin: config.cors.origins,
    credentials: true,
  }));
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // API 路由占位符
  app.get(`${config.app.apiPrefix}/health`, (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // 认证路由
  app.use(`${config.app.apiPrefix}/auth`, authRouter());
  
  // 错误处理中间件
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error', { error: err.message, stack: err.stack });
    
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        code: err.errorCode || 'ERROR',
        message: err.message,
        details: err.details,
      });
    }
    
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: config.app.env === 'development' ? err.message : '系统繁忙，请稍后再试',
    });
  });
  
  // 启动服务器
  app.listen(config.app.port, async () => {
    logger.info(`Server started on port ${config.app.port}`);
    logger.info(`Environment: ${config.app.env}`);
    
    // 初始化依赖
    try {
      await testDatabaseConnection();
      await testRedisConnection();
      await ensureBucketExists();
      logger.info('All dependencies initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize dependencies', { error });
    }
  });
  
  return app;
}

// 启动应用
if (process.env.NODE_ENV !== 'test') {
  bootstrap().catch((error) => {
    logger.error('Failed to start application', { error });
    process.exit(1);
  });
}

export default bootstrap;
