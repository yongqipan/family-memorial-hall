export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface User {
  id: string;
  email: string;
  nickName: string;
  avatar: string | null;
  roleId: 'ADMIN' | 'MEMBER';
  familyId: string | null;
}

export interface Memorial {
  id: string;
  deceasedId: string;
  familyId: string;
  name: string;
  sceneType: 'HALL' | 'TOMBSTONE';
  sceneConfig: SceneConfig;
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

export interface SceneConfig {
  templateId: string;
  background: string;
  lighting: LightingConfig;
  decorations: DecorationConfig[];
  backgroundMusic?: string;
}

export interface LightingConfig {
  ambientIntensity: number;
  ambientColor: string;
  directionalIntensity: number;
  directionalColor: string;
  shadowsEnabled: boolean;
}

export interface DecorationConfig {
  type: string;
  modelUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface RitualType {
  ritualType: 'FLOWER' | 'CANDLE' | 'INCENSE' | 'BOW' | 'OFFERING';
  ritualData: Record<string, any>;
  message?: string;
}

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

export interface FamilyTreeNode extends FamilyMember {
  children: FamilyTreeNode[];
  spouse?: FamilyTreeNode | null;
}

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

export interface Message {
  id: string;
  memorialId: string;
  userId: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  authorNickName: string;
  authorAvatar: string | null;
}

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
