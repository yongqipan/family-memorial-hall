import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import { User, UserInfo, UserStatus } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/errors';

const userRepository = new UserRepository();

export interface RegisterDTO {
  email: string;
  password: string;
  nickName: string;
  inviteCode?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

export async function register(data: RegisterDTO): Promise<AuthResponse> {
  // 检查邮箱是否已存在
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) {
    throw new AppError('该邮箱已被注册', 'USER_ALREADY_EXISTS', 400);
  }

  // 加密密码
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 创建用户
  const newUser = await userRepository.create({
    email: data.email,
    password_hash: hashedPassword,
    nick_name: data.nickName,
    role_id: 'MEMBER',
    status: 'ACTIVE',
    failed_login_attempts: 0,
  });

  // 生成 Token
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.accessTokenExpiresIn,
    user: userRepository.toUserInfo(newUser),
  };
}

export async function login(data: LoginDTO): Promise<AuthResponse> {
  // 查找用户
  const user = await userRepository.findByEmail(data.email);
  if (!user) {
    throw new AppError('邮箱或密码错误', 'INVALID_CREDENTIALS', 401);
  }

  // 验证密码
  const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
  if (!isValidPassword) {
    throw new AppError('邮箱或密码错误', 'INVALID_CREDENTIALS', 401);
  }

  // 生成 Token
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.accessTokenExpiresIn,
    user: userRepository.toUserInfo(user),
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
  try {
    const payload = jwt.verify(refreshToken, config.jwt.refreshTokenSecret) as any;
    
    const user = await userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError('用户不存在', 'USER_NOT_FOUND', 404);
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: config.jwt.accessTokenExpiresIn,
      user: userRepository.toUserInfo(user),
    };
  } catch (error) {
    throw new AppError('无效的刷新令牌', 'INVALID_REFRESH_TOKEN', 401);
  }
}

function generateAccessToken(user: User): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
    },
    config.jwt.accessTokenSecret,
    { expiresIn: config.jwt.accessTokenExpiresIn }
  );
}

function generateRefreshToken(user: User): string {
  return jwt.sign(
    { sub: user.id },
    config.jwt.refreshTokenSecret,
    { expiresIn: config.jwt.refreshTokenExpiresIn }
  );
}
