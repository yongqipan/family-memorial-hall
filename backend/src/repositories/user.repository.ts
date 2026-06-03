import pg from 'pg';
import { BaseRepository } from './base.repository';
import { User, UserInfo, UserStatus, UserRole } from '../models/user.model';
import { UserStatus as UserStatusEnum, UserRole as UserRoleEnum } from '../models/enums';
import { query as dbQuery } from '../config/database';

/**
 * 用户仓储库
 */
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<User | null> {
    const result = await dbQuery(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToEntity(result.rows[0]);
  }

  /**
   * 根据家族 ID 查找所有用户
   */
  async findByFamilyId(familyId: string): Promise<User[]> {
    const result = await dbQuery(
      'SELECT * FROM users WHERE family_id = $1 ORDER BY created_at DESC',
      [familyId]
    );
    
    return result.rows.map((row) => this.mapRowToEntity(row));
  }

  /**
   * 更新用户登录状态
   */
  async updateLoginStatus(
    userId: string,
    success: boolean
  ): Promise<User> {
    if (success) {
      // 登录成功，重置失败计数
      const result = await dbQuery(
        `UPDATE users 
         SET failed_login_attempts = 0, 
             lock_until = NULL, 
             status = 'ACTIVE'::user_status,
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 
         RETURNING *`,
        [userId]
      );
      
      return this.mapRowToEntity(result.rows[0]);
    } else {
      // 登录失败，增加失败计数
      const result = await dbQuery(
        `UPDATE users 
         SET failed_login_attempts = failed_login_attempts + 1,
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 
         RETURNING *`,
        [userId]
      );
      
      return this.mapRowToEntity(result.rows[0]);
    }
  }

  /**
   * 锁定账号
   */
  async lockAccount(userId: string, lockUntil: Date): Promise<User> {
    const result = await dbQuery(
      `UPDATE users 
       SET status = 'LOCKED'::user_status,
           lock_until = $2,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [userId, lockUntil]
    );
    
    return this.mapRowToEntity(result.rows[0]);
  }

  /**
   * 解锁账号
   */
  async unlockAccount(userId: string): Promise<User> {
    const result = await dbQuery(
      `UPDATE users 
       SET status = 'ACTIVE'::user_status,
           lock_until = NULL,
           failed_login_attempts = 0,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [userId]
    );
    
    return this.mapRowToEntity(result.rows[0]);
  }

  /**
   * 更新用户家族
   */
  async updateFamily(userId: string, familyId: string | null): Promise<User> {
    const result = await dbQuery(
      `UPDATE users 
       SET family_id = $2,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [userId, familyId]
    );
    
    return this.mapRowToEntity(result.rows[0]);
  }

  /**
   * 转换用户为不包含敏感信息的 UserInfo
   */
  toUserInfo(user: User): UserInfo {
    return {
      id: user.id,
      email: user.email,
      nickName: user.nickName,
      avatar: user.avatar,
      roleId: user.roleId,
      familyId: user.familyId,
    };
  }

  /**
   * 映射数据库行为实体
   */
  protected mapRowToEntity(row: any): User {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      nickName: row.nick_name,
      avatar: row.avatar,
      roleId: row.role_id as UserRole,
      familyId: row.family_id,
      status: row.status as UserStatus,
      failedLoginAttempts: row.failed_login_attempts,
      lockUntil: row.lock_until,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
