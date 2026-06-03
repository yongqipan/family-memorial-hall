import { MediaType } from './enums';

/**
 * 媒体文件数据模型
 */
export interface Media {
  /** 媒体文件唯一标识符 (UUID) */
  id: string;
  /** 纪念堂 ID */
  memorialId: string;
  /** 上传者 ID */
  userId: string;
  /** 媒体类型 */
  type: MediaType;
  /** CDN URL */
  url: string;
  /** 缩略图 URL */
  thumbnailUrl: string | null;
  /** 原始文件名 */
  fileName: string;
  /** 文件大小 (字节) */
  fileSize: number;
  /** MIME 类型 */
  mimeType: string;
  /** 说明文字 */
  description: string | null;
  /** 拍摄时间 */
  captureDate: Date | null;
  /** 相册 ID (可选，用于分类) */
  albumId: string | null;
  /** 排序顺序 */
  sortOrder: number;
  /** 创建时间 */
  createdAt: Date;
}

/**
 * 上传媒体请求
 */
export interface UploadMediaRequest {
  /** 纪念堂 ID */
  memorialId: string;
  /** 媒体类型 */
  type: MediaType;
  /** 文件名 */
  fileName: string;
  /** 文件大小 (字节) */
  fileSize: number;
  /** MIME 类型 */
  mimeType: string;
  /** 说明文字 */
  description?: string;
  /** 拍摄时间 */
  captureDate?: string;
  /** 相册 ID */
  albumId?: string;
}

/**
 * 媒体上传响应
 */
export interface UploadMediaResponse {
  /** 媒体 ID */
  mediaId: string;
  /** 预签名上传 URL */
  uploadUrl: string;
  /** 媒体访问 URL */
  accessUrl: string;
}

/**
 * 媒体筛选条件
 */
export interface MediaFilter {
  /** 媒体类型 */
  type?: MediaType;
  /** 相册 ID */
  albumId?: string | null;
  /** 分页 */
  limit?: number;
  /** 偏移量 */
  offset?: number;
  /** 排序方式 (ASC 或 DESC) */
  order?: 'ASC' | 'DESC';
}

/**
 * 相册信息
 */
export interface Album {
  /** 相册 ID */
  id: string;
  /** 纪念堂 ID */
  memorialId: string;
  /** 相册名称 */
  name: string;
  /** 相册描述 */
  description: string | null;
  /** 封面照片 ID */
  coverMediaId: string | null;
  /** 照片数量 */
  mediaCount: number;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}
