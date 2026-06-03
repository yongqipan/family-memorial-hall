import { SceneType, RitualType } from './enums';

/**
 * 场景配置接口
 */
export interface SceneConfig {
  /** 场景模板 ID */
  templateId: string;
  /** 背景颜色或天空盒 URL */
  background: string;
  /** 光照配置 */
  lighting: LightingConfig;
  /** 装饰元素配置 */
  decorations: DecorationConfig[];
  /** 背景音乐 URL (可选) */
  backgroundMusic?: string;
}

/**
 * 光照配置
 */
export interface LightingConfig {
  /** 环境光强度 */
  ambientIntensity: number;
  /** 环境光颜色 */
  ambientColor: string;
  /** 平行光强度 */
  directionalIntensity: number;
  /** 平行光颜色 */
  directionalColor: string;
  /** 是否启用阴影 */
  shadowsEnabled: boolean;
}

/**
 * 装饰元素配置
 */
export interface DecorationConfig {
  /** 元素类型 */
  type: string;
  /** 3D 模型 URL */
  modelUrl: string;
  /** 位置坐标 */
  position: [number, number, number];
  /** 旋转角度 */
  rotation: [number, number, number];
  /** 缩放比例 */
  scale: [number, number, number];
}

/**
 * 纪念堂数据模型
 */
export interface Memorial {
  /** 纪念堂唯一标识符 (UUID) */
  id: string;
  /** 逝者 ID (家族成员) */
  deceasedId: string;
  /** 家族 ID */
  familyId: string;
  /** 纪念堂名称 */
  name: string;
  /** 场景类型 */
  sceneType: SceneType;
  /** 3D 场景配置 (JSON) */
  sceneConfig: SceneConfig;
  /** 生平故事 (富文本 HTML) */
  biography: string | null;
  /** 出生日期 */
  birthDate: Date | null;
  /** 逝世日期 */
  deathDate: Date | null;
  /** 忌日 (MM-DD 格式，用于提醒) */
  deathAnniversary: string;
  /** 累计祭拜次数 */
  totalRitualCount: number;
  /** 今日祭拜次数 */
  todayRitualCount: number;
  /** 最后重置祭拜计数的日期 */
  lastRitualResetDate: Date | null;
  /** 已用存储空间 (字节) */
  storageUsed: number;
  /** 存储配额 (字节，默认 10GB) */
  storageQuota: number;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/**
 * 创建纪念堂请求
 */
export interface CreateMemorialRequest {
  deceasedId: string;
  name: string;
  sceneType: SceneType;
  sceneConfig?: Partial<SceneConfig>;
  birthDate?: string;
  deathDate?: string;
  biography?: string;
}

/**
 * 更新纪念堂请求
 */
export interface UpdateMemorialRequest {
  name?: string;
  sceneType?: SceneType;
  sceneConfig?: Partial<SceneConfig>;
  birthDate?: string;
  deathDate?: string;
  biography?: string;
}

/**
 * 纪念堂详情 (包含逝者信息)
 */
export interface MemorialDetail extends Memorial {
  /** 逝者姓名 */
  deceasedName: string;
  /** 逝者头像 */
  deceasedAvatar: string | null;
}

/**
 * 祭拜动作请求
 */
export interface RitualRequest {
  /** 祭拜动作类型 */
  ritualType: RitualType;
  /** 祭拜数据 (根据类型不同而不同) */
  ritualData: RitualData;
  /** 祭拜留言 (可选) */
  message?: string;
}

/**
 * 祭拜数据联合类型
 */
export type RitualData =
  | { flowerType: string; color: string; bouquetSize?: number }
  | { candleType: string; duration?: number }
  | { incenseType: string; count?: number }
  | { bowCount: number }
  | { offeringType: string; items: string[] };

/**
 * 祭拜记录
 */
export interface RitualRecord {
  /** 祭拜记录唯一标识符 (UUID) */
  id: string;
  /** 纪念堂 ID */
  memorialId: string;
  /** 用户 ID */
  userId: string;
  /** 祭拜动作类型 */
  ritualType: RitualType;
  /** 祭拜数据 (JSON) */
  ritualData: RitualData;
  /** 祭拜留言 */
  message: string | null;
  /** 祭拜时间 */
  createdAt: Date;
}

/**
 * 祭拜统计信息
 */
export interface RitualStatistics {
  /** 今日祭拜次数 */
  todayCount: number;
  /** 累计祭拜次数 */
  totalCount: number;
  /** 本周祭拜次数 */
  weekCount: number;
  /** 本月祭拜次数 */
  monthCount: number;
  /** 祭拜类型分布 */
  typeDistribution: Record<RitualType, number>;
  /** 最近 7 天祭拜趋势 */
  last7DaysTrend: { date: string; count: number }[];
}

/**
 * 祭拜记录筛选条件
 */
export interface RitualFilter {
  /** 开始日期 */
  startDate?: Date;
  /** 结束日期 */
  endDate?: Date;
  /** 祭拜类型 */
  ritualType?: RitualType;
  /** 用户 ID */
  userId?: string;
  /** 分页 */
  limit?: number;
  /** 偏移量 */
  offset?: number;
}
