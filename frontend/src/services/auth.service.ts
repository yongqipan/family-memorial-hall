import api from './api';
import { ApiResponse } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickName: string;
  inviteCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    nickName: string;
    avatar: string | null;
    roleId: 'ADMIN' | 'MEMBER';
    familyId: string | null;
  };
}

/**
 * 用户登录
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
  return response.data.data;
}

/**
 * 用户注册
 */
export async function register(data: RegisterRequest): Promise<void> {
  await api.post('/auth/register', data);
}

/**
 * 刷新 Token
 */
export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  const response = await api.post<ApiResponse<LoginResponse>>('/auth/refresh', {
    refreshToken,
  });
  return response.data.data;
}

/**
 * 退出登录
 */
export function logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

/**
 * 检查 Token 是否有效
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
