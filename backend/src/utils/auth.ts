import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config';

/**
 * 密码哈希
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * 验证密码
 */
export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

/**
 * 生成访问令牌
 */
export function generateAccessToken(payload: {
  userId: string;
  email: string;
  roleId: string;
  familyId: string | null;
}): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpiresIn,
  });
}

/**
 * 生成刷新令牌
 */
export function generateRefreshToken(payload: { userId: string }): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshTokenExpiresIn,
  });
}

/**
 * 验证令牌
 */
export interface TokenPayload {
  userId: string;
  email?: string;
  roleId?: string;
  familyId?: string | null;
  iat?: number;
  exp?: number;
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

/**
 * 解码令牌 (不验证)
 */
export function decodeToken(token: string): TokenPayload | null {
  return jwt.decode(token) as TokenPayload | null;
}

/**
 * 刷新令牌
 */
export function refreshAccessToken(refreshToken: string): {
  accessToken: string;
  refreshToken: string;
} {
  const payload = verifyToken(refreshToken);
  
  if (!payload.userId) {
    throw new Error('Invalid refresh token');
  }
  
  const newAccessToken = generateAccessToken({
    userId: payload.userId,
    email: payload.email || '',
    roleId: payload.roleId || 'MEMBER',
    familyId: payload.familyId || null,
  });
  
  const newRefreshToken = generateRefreshToken({ userId: payload.userId });
  
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
