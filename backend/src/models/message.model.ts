/**
 * 留言数据模型
 */
export interface Message {
  /** 留言唯一标识符 (UUID) */
  id: string;
  /** 纪念堂 ID */
  memorialId: string;
  /** 留言者 ID */
  userId: string;
  /** 留言内容 */
  content: string;
  /** 是否已编辑 */
  isEdited: boolean;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/**
 * 创建留言请求
 */
export interface CreateMessageRequest {
  /** 留言内容 */
  content: string;
}

/**
 * 更新留言请求
 */
export interface UpdateMessageRequest {
  /** 留言内容 */
  content: string;
}

/**
 * 留言详情 (包含留言者信息)
 */
export interface MessageDetail extends Message {
  /** 留言者昵称 */
  authorNickName: string;
  /** 留言者头像 */
  authorAvatar: string | null;
}
