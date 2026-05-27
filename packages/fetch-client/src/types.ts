// ==================== 基础响应 ====================

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// ==================== 请求配置 ====================

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export interface FetchRequestConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  retry?: number;
  retryDelay?: number | ((attempt: number) => number);
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
  responseType?: "json" | "text" | "blob" | "arrayBuffer";
  signal?: AbortSignal;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  dedupeKey?: string;
  params?: Record<string, unknown>;
}

// ==================== 错误类型 ====================

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
  Cancelled = "Cancelled",
}

export class FetchError extends Error {
  type: ErrorType;
  code?: number;
  status?: number;
  response?: unknown;

  constructor(
    message: string,
    type: ErrorType,
    opts?: { code?: number; status?: number; response?: unknown }
  ) {
    super(message);
    this.name = "FetchError";
    this.type = type;
    this.code = opts?.code;
    this.status = opts?.status;
    this.response = opts?.response;
  }
}

/** 根据业务错误码映射 ErrorType，业务方可覆盖此逻辑 */
export function getErrorType(code: number): ErrorType {
  if (code === 0) return ErrorType.UnknownError;

  if (code >= 10001 && code <= 10006) {
    if (code === 10005) return ErrorType.RateLimitError;
    if (code >= 10001 && code <= 10003) return ErrorType.ValidationError;
    return ErrorType.ServerError;
  }

  if (code >= 20001 && code <= 20006) {
    if (code === 20002) return ErrorType.TokenExpired;
    if (code === 20004) return ErrorType.TokenReplaced;
    if (code === 20005) return ErrorType.PermissionError;
    if (code === 20006) return ErrorType.AccountFrozen;
    return ErrorType.AuthError;
  }

  if (code >= 30001 && code <= 30005) return ErrorType.ValidationError;

  if (code >= 40001 && code <= 40004) {
    if (code === 40001) return ErrorType.NotFoundError;
    if (code === 40003) return ErrorType.ConflictError;
    return ErrorType.ServerError;
  }

  if (code >= 50001 && code <= 50004) return ErrorType.ServerError;

  return ErrorType.UnknownError;
}

// ==================== 拦截器 ====================

export interface FetchInterceptorContext {
  url: string;
  method: HttpMethod;
  config: FetchRequestConfig;
  body?: unknown;
}

export type RequestInterceptor = (
  ctx: FetchInterceptorContext
) => FetchInterceptorContext | Promise<FetchInterceptorContext>;

export type ResponseInterceptor = (
  response: Response,
  ctx: FetchInterceptorContext
) => Response | Promise<Response>;

export type ResponseErrorInterceptor = (
  error: Error,
  ctx: FetchInterceptorContext
) => Error | Promise<Error>;

// ==================== 进度回调 ====================

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

// ==================== Token 提供者 ====================

export type TokenProvider = () => string | null | Promise<string | null>;

export interface FetchClientOptions extends FetchRequestConfig {
  tokenProvider?: TokenProvider;
  serverSide?: boolean;
}
