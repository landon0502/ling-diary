import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { TOKEN_KEY, REFRESH_TOKEN_KEY, HTTP_STATUS } from "./config";
import { ErrorCode } from "./types";
import { RequestError, ErrorType } from "./types";
// 正在刷新 token 的状态
// let isRefreshing = false;
// 失败队列
// let failedQueue: Array<{
//   resolve: (value?: string) => void;
//   reject: <T = unknown>(reason?: NonNullable<T>) => void;
// }> = [];

// 处理队列
// const processQueue = <T = unknown>(error: T, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token || "");
//     }
//   });
//   failedQueue = [];
// };

// Token 管理
export const tokenManager = {
  // 获取 token
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  // 设置 token
  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  // // 获取 refresh token
  // getRefreshToken(): string | null {
  //   if (typeof window === "undefined") return null;
  //   return localStorage.getItem(REFRESH_TOKEN_KEY);
  // },

  // // 设置 refresh token
  // setRefreshToken(token: string): void {
  //   if (typeof window === "undefined") return;
  //   localStorage.setItem(REFRESH_TOKEN_KEY, token);
  // },

  // 清除 token
  clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

// 刷新 token
// export const refreshToken = async (): Promise<string> => {
//   const refreshToken = tokenManager.getRefreshToken();
//   if (!refreshToken) {
//     throw new RequestError("未找到刷新令牌", ErrorType.AuthError);
//   }

//   try {
//     const response = await axios.post("/api/auth/refresh", { refreshToken });
//     const { token, refreshToken: newRefreshToken } = response.data;

//     tokenManager.setToken(token);
//     if (newRefreshToken) {
//       tokenManager.setRefreshToken(newRefreshToken);
//     }

//     return token;
//   } catch {
//     tokenManager.clearToken();
//     throw new RequestError("刷新令牌失败", ErrorType.AuthError);
//   }
// };

// 请求拦截器
export const setupRequestInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 添加 token
      const token = tokenManager.getToken();
      if (token && !config.headers?.["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      // 添加请求 ID 用于追踪
      config.headers["X-Request-ID"] = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}`;

      // 添加时间戳防止缓存
      if (config.method?.toLowerCase() === "get") {
        config.params = {
          ...config.params,
          _t: Date.now(),
        };
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
};

// 响应拦截器
export const setupResponseInterceptor = (
  instance: AxiosInstance,
  onUnauthorized?: () => void
) => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const { data } = response;

      // 统一响应格式处理
      if (data?.code !== undefined) {
        if (data.code !== ErrorCode.SUCCESS) {
          const error = new RequestError(
            data.message || "请求失败",
            getErrorType(data.code),
            data.code,
            data
          );
          return Promise.reject(error);
        }
        return data;
      }

      return data;
    },
    async (error: AxiosError<{ message: string; code: number }>) => {
      const { config, response } = error;

      // 网络错误
      if (!response) {
        if (error.code === "ECONNABORTED") {
          return Promise.reject(
            new RequestError("请求超时", ErrorType.TimeoutError)
          );
        }
        return Promise.reject(
          new RequestError("网络错误，请检查网络连接", ErrorType.NetworkError)
        );
      }

      const { status, data } = response;

      // Token 过期，尝试刷新
      if (status === HTTP_STATUS.UNAUTHORIZED && config) {
        // if (!isRefreshing) {
        //   isRefreshing = true;
        //   try {
        //     const newToken = await refreshToken();
        //     processQueue(null, newToken);

        //     // 重试原请求
        //     if (config.headers) {
        //       config.headers["Authorization"] = `Bearer ${newToken}`;
        //     }
        //     return instance(config);
        //   } catch (refreshError) {
        //     processQueue(refreshError, null);
        //     tokenManager.clearToken();
        //     onUnauthorized?.();
        //     return Promise.reject(
        //       new RequestError(
        //         "登录已过期，请重新登录",
        //         ErrorType.AuthError,
        //         status
        //       )
        //     );
        //   } finally {
        //     isRefreshing = false;
        //   }
        // }

        // // 将请求加入队列
        // return new Promise((resolve, reject) => {
        //   failedQueue.push({ resolve, reject });
        // })
        //   .then((token) => {
        //     if (config.headers) {
        //       config.headers["Authorization"] = `Bearer ${token}`;
        //     }
        //     return instance(config);
        //   })
        //   .catch((err) => {
        //     return Promise.reject(err);
        //   });
        tokenManager.clearToken();
        onUnauthorized?.();
        return Promise.reject(
          new RequestError(
            "登录已过期，请重新登录",
            ErrorType.AuthError,
            status
          )
        );
      }

      // 403 权限错误
      if (status === HTTP_STATUS.FORBIDDEN) {
        return Promise.reject(
          new RequestError(
            "没有权限访问该资源",
            ErrorType.PermissionError,
            status
          )
        );
      }

      // 404 资源不存在
      if (status === HTTP_STATUS.NOT_FOUND) {
        return Promise.reject(
          new RequestError("请求的资源不存在", ErrorType.ServerError, status)
        );
      }

      // 429 请求过于频繁
      if (status === HTTP_STATUS.TOO_MANY_REQUESTS) {
        return Promise.reject(
          new RequestError(
            "请求过于频繁，请稍后再试",
            ErrorType.ServerError,
            status
          )
        );
      }

      // 5xx 服务器错误
      if (status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        return Promise.reject(
          new RequestError(
            "服务器错误，请稍后再试",
            ErrorType.ServerError,
            status
          )
        );
      }

      // 其他错误
      const message = data?.message || "请求失败";
      return Promise.reject(
        new RequestError(message, ErrorType.UnknownError, status, data)
      );
    }
  );
};

// 根据业务错误码获取错误类型
function getErrorType(code: number): ErrorType {
  // 成功
  if (code === 0) return ErrorType.UnknownError;

  // 系统与通用错误 (10xxx)
  if (code >= 10001 && code <= 10006) {
    if (code === 10005) return ErrorType.RateLimitError;
    if (code >= 10001 && code <= 10003) return ErrorType.ValidationError;
    return ErrorType.ServerError;
  }

  // 认证与授权错误 (20xxx)
  if (code >= 20001 && code <= 20006) {
    if (code === 20002) return ErrorType.TokenExpired;
    if (code === 20004) return ErrorType.TokenReplaced;
    if (code === 20005) return ErrorType.PermissionError;
    if (code === 20006) return ErrorType.AccountFrozen;
    return ErrorType.AuthError;
  }

  // 用户与账户业务 (30xxx)
  if (code >= 30001 && code <= 30005) {
    return ErrorType.ValidationError;
  }

  // 数据与资源错误 (40xxx)
  if (code >= 40001 && code <= 40004) {
    if (code === 40001) return ErrorType.NotFoundError;
    if (code === 40003) return ErrorType.ConflictError;
    return ErrorType.ServerError;
  }

  // 第三方服务与文件错误 (50xxx)
  if (code >= 50001 && code <= 50004) {
    return ErrorType.ServerError;
  }

  return ErrorType.UnknownError;
}
