import { useRequest } from "ahooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getPlatforms,
  saveAiConfig,
  getUserAiConfig,
} from "@/services/ai-platforms";

import { createAiConfigSchema } from "./schemas";
import { useTranslations } from "next-intl";

/**
 * Settings 页面的数据与表单逻辑层
 * - platformsControl: 挂载时自动请求平台列表（manual: false）
 * - form: react-hook-form 实例，绑定 zod 校验
 */
export default function useService() {
  const t = useTranslations("settings");
  const aiConfigSchema = createAiConfigSchema(t);
  // 默认空值 — 用于表单初始化和取消时回退
  const defaultValues: z.infer<typeof aiConfigSchema> = {
    platform: "",
    model: "",
    api_key: "",
    auth_url: "",
  };

  const platformsControl = useRequest(getPlatforms, { manual: false });

  const form = useForm<z.infer<typeof aiConfigSchema>>({
    resolver: zodResolver(aiConfigSchema),
    defaultValues,
  });

  const saveConfigControl = useRequest(saveAiConfig, { manual: true });

  const getConfigControl = useRequest(getUserAiConfig, { manual: false });

  return {
    platformsControl,
    form,
    defaultValues,
    saveConfigControl,
    getConfigControl,
  };
}
