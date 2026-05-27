// 响应数据接口
export interface ApiResponse<T = unknown> {
  code: number;
  data?: T;
  message: string;
}

// 业务错误码
export const ErrorCode = {
  // 成功
  SUCCESS: 0,

  // 系统与通用错误 (10xxx)
  PARAM_FORMAT_ERROR: 10001,
  MISSING_PARAM: 10002,
  PARAM_TYPE_ERROR: 10003,
  INTERFACE_OFFLINE: 10004,
  RATE_LIMIT_EXCEEDED: 10005,
  SYSTEM_INTERNAL_ERROR: 10006,

  // 认证与授权错误 (20xxx)
  NO_AUTH_TOKEN: 20001,
  TOKEN_EXPIRED: 20002,
  TOKEN_INVALID: 20003,
  TOKEN_REPLACED: 20004,
  PERMISSION_DENIED: 20005,
  ACCOUNT_FROZEN: 20006,

  // 用户与账户业务 (30xxx)
  INVALID_CREDENTIALS: 30001,
  USER_ALREADY_EXISTS: 30002,
  USER_NOT_FOUND: 30003,
  VERIFY_CODE_INVALID: 30004,
  SAME_PASSWORD: 30005,

  // 数据与资源错误 (40xxx)
  RESOURCE_NOT_FOUND: 40001,
  RESOURCE_STATUS_INVALID: 40002,
  DATA_CONFLICT: 40003,
  DATA_WRITE_FAILED: 40004,

  // 第三方服务与文件错误 (50xxx)
  FILE_UPLOAD_FAILED: 50001,
  PAYMENT_TIMEOUT: 50002,
  SMS_SEND_FAILED: 50003,
  REMOTE_SERVICE_UNAVAILABLE: 50004,
} as const;

// 请求配置接口
export interface RequestConfig {
  skipAuth?: boolean; // 跳过 token 验证
  skipErrorHandler?: boolean; // 跳过错误处理
  retryCount?: number; // 重试次数
  retryDelay?: number; // 重试延迟(ms)
  timeout?: number; // 请求超时时间(ms)
  headers?: Record<string, string>; // 自定义请求头
}

// 错误类型
export enum ErrorType {
  NetworkError = "NetworkError",
  TimeoutError = "TimeoutError",
  AuthError = "AuthError",
  TokenExpired = "TokenExpired",
  TokenReplaced = "TokenReplaced",
  PermissionError = "PermissionError",
  AccountFrozen = "AccountFrozen",
  ValidationError = "ValidationError",
  NotFoundError = "NotFoundError",
  ConflictError = "ConflictError",
  RateLimitError = "RateLimitError",
  ServerError = "ServerError",
  UnknownError = "UnknownError",
}

// 自定义错误类
export class RequestError extends Error {
  type: ErrorType;
  code?: number;
  response?: unknown;

  constructor(
    message: string,
    type: ErrorType,
    code?: number,
    response?: unknown
  ) {
    super(message);
    this.name = "RequestError";
    this.type = type;
    this.code = code;
    this.response = response;
  }
}
