/**
 * API 响应类型
 */
export interface ApiResponse<T = any> {
  code: string;
  message: string;
  data?: T;
}

/**
 * 用户类型
 */
export interface User {
  id: string;
  email: string;
  nickName: string;
  avatar: string | null;
  roleId: 'ADMIN' | 'MEMBER';
  familyId: string | null;
}

/**
 * 纪念堂类型
 */
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

/**
 * 祭拜动作类型
 */
export interface RitualAction {
  ritualType: 'FLOWER' | 'CANDLE' | 'INCENSE' | 'BOW' | 'OFFERING';
  ritualData: Record<string, any>;
  message?: string;
}

/**
 * 家族成员类型
 */
export interface FamilyMember {
  id: string;
  familyId: string;
  userId: string | null;
  name: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string | null;
  deathDate: string | null;
  isDeceased: boolean;
  memorialId: string | null;
  parentId: string | null;
  motherId: string | null;
  spouseId: string | null;
  generation: number;
  sortOrder: number;
  biography: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 媒体文件类型
 */
export interface Media {
  id: string;
  memorialId: string;
  userId: string;
  type: 'PHOTO' | 'VIDEO';
  url: string;
  thumbnailUrl: string | null;
  fileName: string;
  fileSize: number;
  mimeType: string;
  description: string | null;
  captureDate: string | null;
  albumId: string | null;
  sortOrder: number;
  createdAt: string;
}

/**
 * 留言类型
 */
export interface Message {
  id: string;
  memorialId: string;
  userId: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  authorNickName?: string;
  authorAvatar?: string | null;
}

/**
 * 通知类型
 */
export interface Notification {
  id: string;
  userId: string;
  type: 'DEATH_ANNIVERSARY' | 'SYSTEM' | 'INVITATION';
  title: string;
  content: string;
  data: Record<string, any> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}
