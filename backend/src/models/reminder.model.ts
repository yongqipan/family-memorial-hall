import { ReminderType, ReminderStatus } from './enums';

/**
 * 提醒数据模型
 */
export interface Reminder {
  /** 提醒唯一标识符 (UUID) */
  id: string;
  /** 纪念堂 ID */
  memorialId: string;
  /** 逝者 ID */
  deceasedId: string;
  /** 提醒类型 */
  type: ReminderType;
  /** 计划发送日期 */
  scheduleDate: Date;
  /** 实际发送时间 */
  sentAt: Date | null;
  /** 提醒状态 */
  status: ReminderStatus;
  /** 重试次数 */
  retryCount: number;
  /** 创建时间 */
  createdAt: Date;
}

/**
 * 调度提醒请求
 */
export interface ScheduleReminderRequest {
  /** 纪念堂 ID */
  memorialId: string;
  /** 逝者 ID */
  deceasedId: string;
  /** 提醒类型 */
  type: ReminderType;
  /** 计划发送日期 */
  scheduleDate: string;
}

/**
 * 提醒配置
 */
export interface ReminderConfig {
  /** 是否启用邮件提醒 */
  emailEnabled: boolean;
  /** 是否启用站内通知 */
  inAppEnabled: boolean;
  /** 提前提醒天数 */
  daysBefore: number;
  /** 发送时间 (小时，24 小时制) */
  sendHour: number;
}

/**
 * 站内通知
 */
export interface Notification {
  /** 通知唯一标识符 (UUID) */
  id: string;
  /** 接收者 ID */
  userId: string;
  /** 通知类型 */
  type: NotificationType;
  /** 通知标题 */
  title: string;
  /** 通知内容 */
  content: string;
  /** 关联数据 (JSON) */
  data: Record<string, any> | null;
  /** 是否已读 */
  isRead: boolean;
  /** 阅读时间 */
  readAt: Date | null;
  /** 创建时间 */
  createdAt: Date;
}

/**
 * 通知类型
 */
export enum NotificationType {
  /** 忌日提醒 */
  DEATH_ANNIVERSARY = 'DEATH_ANNIVERSARY',
  /** 系统通知 */
  SYSTEM = 'SYSTEM',
  /** 邀请函 */
  INVITATION = 'INVITATION',
}

/**
 * 创建通知请求
 */
export interface CreateNotificationRequest {
  /** 接收者 ID */
  userId: string;
  /** 通知类型 */
  type: NotificationType;
  /** 通知标题 */
  title: string;
  /** 通知内容 */
  content: string;
  /** 关联数据 */
  data?: Record<string, any>;
}
