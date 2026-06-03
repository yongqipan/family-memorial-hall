import pg from 'pg';
import { query, transaction } from '../config/database';
import { NotFoundError } from '../utils/errors';
import winston from 'winston';

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
 * 基础仓储库类
 */
export abstract class BaseRepository<T extends { id: string }> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * 根据 ID 查找
   */
  async findById(id: string, client?: pg.PoolClient): Promise<T | null> {
    const qr = client ? await client.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id])
                      : await query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
    
    if (qr.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToEntity(qr.rows[0]);
  }

  /**
   * 查找所有
   */
  async findAll(client?: pg.PoolClient): Promise<T[]> {
    const qr = client ? await client.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`)
                      : await query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
    
    return qr.rows.map((row) => this.mapRowToEntity(row));
  }

  /**
   * 创建实体
   */
  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>, client?: pg.PoolClient): Promise<T> {
    const keys = Object.keys(entity);
    const values = Object.values(entity);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const qr = client
      ? await client.query(
          `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
          values
        )
      : await query(
          `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
          values
        );

    return this.mapRowToEntity(qr.rows[0]);
  }

  /**
   * 更新实体
   */
  async update(id: string, entity: Partial<T>, client?: pg.PoolClient): Promise<T> {
    const keys = Object.keys(entity);
    if (keys.length === 0) {
      throw new Error('No fields to update');
    }

    const values = Object.values(entity);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const qr = client
      ? await client.query(
          `UPDATE ${this.tableName} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
          [...values, id]
        )
      : await query(
          `UPDATE ${this.tableName} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
          [...values, id]
        );

    if (qr.rows.length === 0) {
      throw new NotFoundError(this.tableName.slice(0, -1), id);
    }

    return this.mapRowToEntity(qr.rows[0]);
  }

  /**
   * 删除实体
   */
  async delete(id: string, client?: pg.PoolClient): Promise<void> {
    const qr = client
      ? await client.query(`DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`, [id])
      : await query(`DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`, [id]);

    if (qr.rows.length === 0) {
      throw new NotFoundError(this.tableName.slice(0, -1), id);
    }
  }

  /**
   * 执行事务
   */
  async withTransaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
    return transaction(fn);
  }

  /**
   * 将数据库行映射为实体
   */
  protected abstract mapRowToEntity(row: any): T;

  /**
   * 记录日志
   */
  protected log(action: string, data?: any): void {
    logger.info(`${this.tableName}: ${action}`, data);
  }
}
