/**
 * 自定义业务异常类
 */
export class BusinessException extends Error {
  statusCode: number;
  errorCode: string;
  details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 400,
    errorCode: string = 'BUSINESS_ERROR',
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'BusinessException';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

/**
 * 认证相关异常
 */
export class AuthenticationError extends BusinessException {
  constructor(message: string = '认证失败', errorCode: string = 'AUTH_FAILED') {
    super(message, 401, errorCode);
    this.name = 'AuthenticationError';
  }
}

export class TokenExpiredError extends AuthenticationError {
  constructor() {
    super('Token 已过期', 'TOKEN_EXPIRED');
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends AuthenticationError {
  constructor() {
    super('无效的 Token', 'INVALID_TOKEN');
    this.name = 'InvalidTokenError';
  }
}

export class AccountLockedError extends AuthenticationError {
  lockUntil: Date;
  constructor(lockUntil: Date) {
    super(`账号已被锁定，请等待后重试`, 'ACCOUNT_LOCKED');
    this.name = 'AccountLockedError';
    this.lockUntil = lockUntil;
  }
}

/**
 * 数据验证异常
 */
export class ValidationError extends BusinessException {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * 资源未找到异常
 */
export class NotFoundError extends BusinessException {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} 不存在 (ID: ${id})`
      : `${resource} 不存在`;
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * 权限不足异常
 */
export class ForbiddenError extends BusinessException {
  constructor(message: string = '没有权限执行此操作') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

/**
 * 冲突异常
 */
export class ConflictError extends BusinessException {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

/**
 * 存储空间不足异常
 */
export class StorageExceededError extends BusinessException {
  constructor() {
    super('存储空间不足', 400, 'STORAGE_EXCEEDED');
    this.name = 'StorageExceededError';
  }
}

/**
 * 文件过大异常
 */
export class FileTooLargeError extends BusinessException {
  constructor(maxSize: string = '100MB') {
    super(`文件大小不能超过 ${maxSize}`, 400, 'FILE_TOO_LARGE');
    this.name = 'FileTooLargeError';
  }
}

/**
 * 协作编辑冲突异常
 */
export class CollaborationConflictError extends BusinessException {
  constructor() {
    super('编辑发生冲突，请合并版本', 409, 'COLLAB_CONFLICT');
    this.name = 'CollaborationConflictError';
  }
}
