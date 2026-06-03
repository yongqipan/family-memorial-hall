import api from './api';
import { ApiResponse } from '../types';

export interface Memorial {
  id: string;
  deceasedId: string;
  familyId: string;
  name: string;
  sceneType: 'HALL' | 'TOMBSTONE';
  sceneConfig: any;
  biography: string | null;
  birthDate: string | null;
  deathDate: string | null;
  deathAnniversary: string;
  totalRitualCount: number;
  todayRitualCount: number;
  storageUsed: number;
  storageQuota: number;
  createdAt: string;
  updatedAt: string;
}

export interface RitualType {
  ritualType: 'FLOWER' | 'CANDLE' | 'INCENSE' | 'BOW' | 'OFFERING';
  ritualData: Record<string, any>;
  message?: string;
}

/**
 * 获取纪念堂详情
 */
export async function getMemorial(id: string): Promise<Memorial> {
  const response = await api.get<ApiResponse<Memorial>>(`/memorials/${id}`);
  return response.data.data;
}

/**
 * 创建纪念堂
 */
export async function createMemorial(data: {
  deceasedId: string;
  name: string;
  sceneType: 'HALL' | 'TOMBSTONE';
  sceneConfig?: any;
}): Promise<Memorial> {
  const response = await api.post<ApiResponse<Memorial>>('/memorials', data);
  return response.data.data;
}

/**
 * 执行祭拜
 */
export async function performRitual(
  memorialId: string,
  data: RitualType
): Promise<void> {
  await api.post(`/memorials/${memorialId}/rituals`, data);
}

/**
 * 获取祭拜统计
 */
export async function getRitualStatistics(memorialId: string): Promise<any> {
  const response = await api.get(`/memorials/${memorialId}/statistics`);
  return response.data.data;
}
