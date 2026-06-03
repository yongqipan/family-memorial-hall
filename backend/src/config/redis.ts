import Redis from 'ioredis';
import config from '../config';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/redis.log' }),
  ],
});

/**
 * Redis 客户端
 */
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.db,
  retryStrategy: (times) => {
    if (times > 10) {
      logger.error('Redis connection failed after multiple retries');
      return null;
    }
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('Redis connection established');
});

redis.on('error', (error) => {
  logger.error('Redis connection error', { error });
});

/**
 * 测试 Redis 连接
 */
export async function testConnection(): Promise<void> {
  try {
    await redis.ping();
    logger.info('Redis ping successful');
  } catch (error) {
  logger.error('Redis ping failed', { error });
    throw error;
  }
}

/**
 * 设置键值对 (带过期时间)
 */
export async function set(
  key: string,
  value: string,
  expiresInSeconds?: number
): Promise<void> {
  if (expiresInSeconds) {
    await redis.setex(key, expiresInSeconds, value);
  } else {
    await redis.set(key, value);
  }
}

/**
 * 获取值
 */
export async function get(key: string): Promise<string | null> {
  return redis.get(key);
}

/**
 * 删除键
 */
export async function del(key: string): Promise<number> {
  return redis.del(key);
}

/**
 * 检查键是否存在
 */
export async function exists(key: string): Promise<number> {
  return redis.exists(key);
}

/**
 * 增加计数
 */
export async function incr(key: string): Promise<number> {
  return redis.incr(key);
}

/**
 * 设置过期时间
 */
export async function expire(key: string, seconds: number): Promise<number> {
  return redis.expire(key, seconds);
}

export default redis;
