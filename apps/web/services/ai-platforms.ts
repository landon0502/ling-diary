import fetchClient, { type ApiResponse } from "@/lib/fetch";
import type { AIPlatform, UserAiConfig } from "@/config/ai-platforms";

/**
 * 获取ai平台选项
 * @returns
 */
export async function getPlatforms(): Promise<ApiResponse<AIPlatform[]>> {
  return fetchClient.get("/ai/platforms");
}

/**
 * 保存用户ai 模型配置
 * @returns
 */
export async function saveAiConfig(
  data: UserAiConfig
): Promise<ApiResponse<{ success: boolean }>> {
  return fetchClient.post("/ai/saveConfig", data);
}

/**
 * 获取用户ai配置
 */
export async function getUserAiConfig() {
  return fetchClient.get("/ai/userAiConf");
}
