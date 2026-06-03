import { UserStatus, UserRole } from './enums';

/**
 * 用户数据模型接口
 */
export interface User {
  /** 用户唯一标识符 (UUID) */
  id: string;
  /** 邮箱地址 */
  email: string;
  /** 密码哈希值 */
  passwordHash: string;
  /** 用户昵称 */
  nickName: string;
  /** 头像 URL */
  avatar: string | null;
  /** 用户角色 */
  roleId: UserRole;
  /** 所属家族 ID */
  familyId: string | null;
  /** 账号状态 */
  status: UserStatus;
  /** 登录失败次数 */
  failedLoginAttempts: number;
  /** 账号锁定截止时间 */
  lockUntil: Date | null;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/**
 * 用户注册请求
 */
export interface RegisterRequest {
  email: string;
  password: string;
  nickName: string;
  inviteCode?: string;
}

/**
 * 用户登录请求
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

/**
 * Token 刷新响应
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * 用户信息 (不含敏感数据)
 */
export interface UserInfo {
  id: string;
  email: string;
  nickName: string;
  avatar: string | null;
  roleId: UserRole;
  familyId: string | null;
}

/**
 * 邀请成员请求
 */
export interface InviteRequest {
  email: string;
  roleId: UserRole;
}
