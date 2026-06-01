import { z } from "zod";
export function createAiConfigSchema(t: (key: string) => string) {
  return z.object({
    platform: z.string().min(1, t("selectPlatformMsg")),
    model: z.string().min(1, t("selectModelMsg")),
    api_key: z.string().min(1, t("enterApiKeyMsg")),
    // auth_url 非必填：非自定义平台会自动填充，自定义平台需手动输入
    auth_url: z.string(),
  });
}
