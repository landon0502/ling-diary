import { FetchClient } from "@ling-diary/fetch-client";
import { tokenManager } from "./token-manager";
import { TOKEN_KEY, APP_CONFIG } from "./config";
import { toast } from "sonner";
// 默认实例（客户端），注入 token 提供者
const fetchClient = new FetchClient({
  baseURL: APP_CONFIG.baseURL,
  tokenProvider: () => tokenManager.getToken(),
});

fetchClient.useResponseErrorInterceptor((err) => {
  toast.error(err.toString(), { position: "top-center" });
  return err;
});

// ---- re-export 泛型类型 ----
export type {
  ApiResponse,
  FetchRequestConfig,
  HttpMethod,
  UploadProgress,
  FetchInterceptorContext,
} from "@ling-diary/fetch-client";

export {
  FetchError,
  ErrorType,
  type RequestInterceptor,
  type ResponseInterceptor,
  type ResponseErrorInterceptor,
} from "@ling-diary/fetch-client";

// ---- 业务专属 ----
export { ErrorCode } from "./types";
export {
  HTTP_STATUS,
  PERMISSION_CODE,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "./config";

export { InterceptorManager } from "@ling-diary/fetch-client";
export { tokenManager } from "./token-manager";
export { FetchClient };

export { fetchClient };
export default fetchClient;

/**
 * 创建服务端 FetchClient 实例，用于 Server Component / Server Action。
 * 通过 `next/headers` 的 cookies() 读取 auth_token。
 */
export async function createServerClient(): Promise<FetchClient> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return new FetchClient({
    baseURL: APP_CONFIG.baseURL,
    serverSide: true,
    tokenProvider: () => cookieStore.get(TOKEN_KEY)?.value ?? null,
  });
}
