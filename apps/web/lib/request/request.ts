import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios";
import { DEFAULT_CONFIG } from "./config";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from "./interceptors";
import type { RequestConfig, ApiResponse } from "./types";

/**
 * 创建请求实例
 */
class Request {
  private instance: AxiosInstance;
  private onUnauthorized?: () => void;

  constructor(config?: RequestConfig) {
    this.instance = axios.create({
      baseURL: DEFAULT_CONFIG.baseURL,
      timeout: DEFAULT_CONFIG.timeout,
      headers: DEFAULT_CONFIG.headers,
      ...config,
    });

    this.setupInterceptors();
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors() {
    setupRequestInterceptor(this.instance);
    setupResponseInterceptor(this.instance, this.onUnauthorized);
  }

  /**
   * 设置未授权回调
   */
  setUnauthorizedCallback(callback: () => void) {
    this.onUnauthorized = callback;
    this.instance.interceptors.response.clear();
    this.setupInterceptors();
  }

  /**
   * 设置基础 URL
   */
  setBaseURL(url: string) {
    this.instance.defaults.baseURL = url;
  }

  /**
   * 设置请求头
   */
  setHeader(key: string, value: string) {
    this.instance.defaults.headers[key] = value;
  }

  /**
   * 删除请求头
   */
  removeHeader(key: string) {
    delete this.instance.defaults.headers[key];
  }

  /**
   * 通用请求方法
   */
  async request<T, R>(
    url: string,
    method: Method = "GET",
    data?: T,
    config?: RequestConfig
  ): Promise<ApiResponse<R>> {
    const axiosConfig: AxiosRequestConfig = {
      url,
      method,
      data: method === "GET" || method === "DELETE" ? undefined : data,
      params: method === "GET" || method === "DELETE" ? data : undefined,
      ...config,
    };

    try {
      const response = await this.instance.request<T, ApiResponse<R>>(
        axiosConfig
      );
      return response;
    } catch (error) {
      // 如果配置了跳过错误处理，直接抛出
      if (config?.skipErrorHandler) {
        throw error;
      }
      throw error;
    }
  }

  /**
   * GET 请求
   */
  get<R, T = unknown>(
    url: string,
    params?: T,
    config?: RequestConfig
  ): Promise<ApiResponse<R>> {
    return this.request<T, R>(url, "GET", params as T, config);
  }

  /**
   * POST 请求
   */
  post<R, T = unknown>(
    url: string,
    data?: T,
    config?: RequestConfig
  ): Promise<ApiResponse<R>> {
    return this.request<T, R>(url, "POST", data, config);
  }

  /**
   * PUT 请求
   */
  put<R, T = unknown>(
    url: string,
    data?: T,
    config?: RequestConfig
  ): Promise<ApiResponse<R>> {
    return this.request<T, R>(url, "PUT", data, config);
  }

  /**
   * PATCH 请求
   */
  patch<R, T = unknown>(
    url: string,
    data?: T,
    config?: RequestConfig
  ): Promise<ApiResponse<R>> {
    return this.request<T, R>(url, "PATCH", data, config);
  }

  /**
   * DELETE 请求
   */
  delete<R, T = unknown>(
    url: string,
    params?: T,
    config?: RequestConfig
  ): Promise<ApiResponse<R>> {
    return this.request<T, R>(url, "DELETE", params, config);
  }

  /**
   * 上传文件
   */
  upload<T = unknown>(
    url: string,
    formData: FormData,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    });
  }

  /**
   * 下载文件
   */
  download(url: string, config?: RequestConfig): Promise<Blob> {
    return this.instance.get(url, {
      responseType: "blob",
      ...config,
    });
  }

  /**
   * 取消请求
   */
  cancel() {
    // 可以实现请求取消逻辑
  }
}

// 创建默认实例
const request = new Request();

// 类型导出
export type { ApiResponse, RequestConfig } from "./types";
export { RequestError, ErrorType } from "./types";
export { tokenManager } from "./interceptors";
export { DEFAULT_CONFIG, HTTP_STATUS, PERMISSION_CODE } from "./config";
export { Request };

// 导出默认请求实例
export { request };
export default request;
