/**
 * 系统用户状态枚举
 */
export enum UserStatus {
  /** 活跃状态 */
  ACTIVE = 'ACTIVE',
  /** 账号被锁定 */
  LOCKED = 'LOCKED',
  /** 账号被禁用 */
  DISABLED = 'DISABLED',
}

/**
 * 纪念堂场景类型
 */
export enum SceneType {
  /** 祠堂场景 */
  HALL = 'HALL',
  /** 墓碑场景 */
  TOMBSTONE = 'TOMBSTONE',
}

/**
 * 祭拜动作类型
 */
export enum RitualType {
  /** 献花 */
  FLOWER = 'FLOWER',
  /** 点烛 */
  CANDLE = 'CANDLE',
  /** 上香 */
  INCENSE = 'INCENSE',
  /** 鞠躬 */
  BOW = 'BOW',
  /** 供奉祭品 */
  OFFERING = 'OFFERING',
}

/**
 * 媒体文件类型
 */
export enum MediaType {
  /** 照片 */
  PHOTO = 'PHOTO',
  /** 视频 */
  VIDEO = 'VIDEO',
}

/**
 * 提醒类型
 */
export enum ReminderType {
  /** 邮件提醒 */
  EMAIL = 'EMAIL',
  /** 站内通知 */
  IN_APP = 'IN_APP',
  /** 两者都发送 */
  BOTH = 'BOTH',
}

/**
 * 提醒状态
 */
export enum ReminderStatus {
  /** 待发送 */
  PENDING = 'PENDING',
  /** 已发送 */
  SENT = 'SENT',
  /** 发送失败 */
  FAILED = 'FAILED',
}

/**
 * 性别枚举
 */
export enum Gender {
  /** 男性 */
  MALE = 'MALE',
  /** 女性 */
  FEMALE = 'FEMALE',
}

/**
 * 用户角色类型
 */
export enum UserRole {
  /** 家族管理员 */
  ADMIN = 'ADMIN',
  /** 普通家族成员 */
  MEMBER = 'MEMBER',
}
