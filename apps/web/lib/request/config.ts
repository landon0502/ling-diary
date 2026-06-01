const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

// Token 存储键名
export const TOKEN_KEY = "auth_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

// HTTP 状态码映射
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// 默认配置
export const DEFAULT_CONFIG = {
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  maxRetry: 2,
  retryDelay: 1000,
};

// 权限码
export const PERMISSION_CODE = {
  LOGIN: "user:login",
  LOGOUT: "user:logout",
  READ: "data:read",
  WRITE: "data:write",
  DELETE: "data:delete",
  ADMIN: "admin:*",
} as const;
