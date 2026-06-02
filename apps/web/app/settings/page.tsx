"use client";

import { useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Bell,
  User,
  Settings as SettingsIcon,
  Moon,
  Globe,
  Brain,
  Check,
  X,
  Loader2,
  Boxes,
  Bot,
  Link as LinkIcon,
  UserKey,
  MoreHorizontal,
} from "lucide-react";
import { useTheme } from "@teispace/next-themes";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { type AIPlatform } from "@/config/ai-platforms";
import useService from "./useServices";
import { useAuthStore } from "@/stores/auth-store";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useMounted } from "@/hooks";
import { Field, FieldError } from "@/components/ui/field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MagicCard } from "@/components/ui/magic-card";
export default function SettingsPage() {
  const t = useTranslations("settings");
  const themeT = useTranslations("theme");
  const user = useAuthStore((s) => s.user);
  const { theme } = useTheme();

  // mounted 用于解决 SSR 水合不一致：服务端无 localStorage，渲染 &nbsp; 占位；
  // 客户端 useEffect 后将 mounted 置 true，再渲染真实用户名。
  const mounted = useMounted();

  // 表单由 useService 统一管理：平台列表请求 + zod 校验 + react-hook-form 状态
  const {
    platformsControl,
    form,
    defaultValues,
    saveConfigControl,
    getConfigControl,
  } = useService();
  const {
    control,
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = form;

  const { data: aiConfig } = getConfigControl;
  const selectedPlatform = watch("platform");

  const platforms = useMemo<AIPlatform[]>(() => {
    if (platformsControl.data?.code === 0) {
      return platformsControl.data.data;
    }
    return [];
  }, [platformsControl.data]);

  const platform = useMemo<AIPlatform | undefined>(
    () => platforms.find((p) => p.label === selectedPlatform),
    [selectedPlatform, platforms]
  );

  // 回显已保存的 AI 配置到表单。
  // 必须等 platforms 加载完毕后再 reset，否则模型 Select 的选项列表为空，
  // Radix Select 无法将 value 匹配到对应的 SelectItem，导致模型字段显示为 placeholder。
  useEffect(() => {
    if (aiConfig?.data && platforms.length > 0) {
      reset(aiConfig.data);
    }
  }, [aiConfig, platforms, reset]);
  // 切换平台时的副作用：
  // 1. 重置模型选择（不同平台的模型列表不同）
  // 2. 非自定义平台自动填充 auth_url，自定义平台清空
  // shouldDirty: true 确保表单感知变更，底部按钮会随之出现
  const handlePlatformChange = (label: string) => {
    setValue("platform", label, { shouldDirty: true });
    setValue("model", "", { shouldDirty: true });
    const p = platforms.find((p) => p.label === label);
    if (p) {
      setValue("auth_url", p.auth_url, { shouldDirty: true });
    } else {
      setValue("auth_url", "", { shouldDirty: true });
    }
  };

  const handleModelChange = (value: string) => {
    setValue("model", value, { shouldDirty: true });
  };

  // 确认：handleSubmit 会先走 zod 校验，通过后才执行回调。
  // reset(values) 以当前值作为新基准，使 isDirty 回到 false，按钮消失。
  const onConfirm = handleSubmit(async (values) => {
    await saveConfigControl.runAsync(values);
    reset(values);
  });

  // 取消：回退到已保存的配置（或初始空值），丢弃所有修改
  const onCancel = () => {
    reset(aiConfig?.data ?? defaultValues);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t("personalInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <div className="font-medium text-foreground">
                {mounted ? user?.username : " "}
              </div>
              <div className="text-sm text-muted-foreground">
                {mounted ? user?.email : " "}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            {t("editProfile")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            {t("appSettings")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {t("darkMode")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("currentTheme", {
                    theme: {
                      dark: themeT("dark"),
                      system: themeT("system"),
                      light: themeT("light"),
                    }[theme]!,
                  })}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <ThemeToggle>
                <span>
                  {
                    {
                      dark: themeT("dark"),
                      system: themeT("system"),
                      light: themeT("light"),
                    }[theme]!
                  }
                </span>
              </ThemeToggle>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {t("language")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("currentLanguage")}
                </div>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {t("dailyReminder")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("dailyReminderTime")}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {t("setReminder")}
            </Button>
          </div>
        </CardContent>
      </Card>
      <MagicCard
        mode="orb"
        glowFrom={theme === "dark" ? "#ee4f27" : "#E9D5FF"}
        glowTo={theme === "dark" ? "#6b21ef" : "#FBCFE8"}
        className="p-0 overflow-hidden rounded rounded-xl"
      >
        <Card className="relative w-full overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              {t("aiConfigs")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <form
              id="form-ai-config"
              onSubmit={onConfirm}
              className="flex flex-col gap-3"
            >
              {/* 平台名称 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Boxes className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {t("platformName")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("platformNameHint")}
                    </div>
                  </div>
                </div>
                <div className="w-72">
                  <Controller
                    name="platform"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroup className="[--radius:1rem]">
                          <InputGroupInput
                            placeholder="请输入AI平台"
                            value={field.value}
                            onChange={(value) =>
                              setValue("platform", value.target.value, {
                                shouldDirty: true,
                              })
                            }
                          />
                          <InputGroupAddon align="inline-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <InputGroupButton
                                  variant="ghost"
                                  className="pr-1.5! text-xs"
                                >
                                  <MoreHorizontal />
                                </InputGroupButton>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="[--radius:0.95rem]"
                              >
                                <DropdownMenuGroup>
                                  {platforms.map((p) => (
                                    <DropdownMenuItem
                                      key={p.label}
                                      onClick={() =>
                                        handlePlatformChange(p.label)
                                      }
                                    >
                                      {p.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>
                    )}
                  />
                </div>
              </div>

              {/* 模型 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {t("model")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("modelHint")}
                    </div>
                  </div>
                </div>
                <div className="w-72">
                  <Controller
                    name="model"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroup className="[--radius:1rem]">
                          <InputGroupInput
                            placeholder="请输入模型名称"
                            value={field.value}
                            onChange={(value) =>
                              setValue("model", value.target.value, {
                                shouldDirty: true,
                              })
                            }
                          />
                          <InputGroupAddon align="inline-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <InputGroupButton
                                  variant="ghost"
                                  className="pr-1.5! text-xs"
                                >
                                  <MoreHorizontal />
                                </InputGroupButton>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="[--radius:0.95rem]"
                              >
                                <DropdownMenuGroup>
                                  {platform?.models.map((p) => (
                                    <DropdownMenuItem
                                      key={p.value}
                                      onClick={() => handleModelChange(p.value)}
                                    >
                                      {p.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>
                    )}
                  />
                </div>
              </div>

              {/* API KEY */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserKey className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      API KEY
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("apiKeyHint")}
                    </div>
                  </div>
                </div>
                <div className="w-72">
                  <Controller
                    name="api_key"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          {...register("api_key")}
                          value={field.value}
                          type="password"
                          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full h-8 bg-input border-border focus:border-primary focus:ring-primary/20"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>

              {/* 认证 URL */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LinkIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {t("authUrl")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("authUrlHint")}
                    </div>
                  </div>
                </div>
                <div className="w-72">
                  <Controller
                    name="auth_url"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          {...register("auth_url")}
                          value={field.value}
                          type="text"
                          placeholder="https://api..."
                          className="w-full h-8 bg-input border-border focus:border-primary focus:ring-primary/20"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>

              {/* 确认 / 取消 */}
              {isDirty && (
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t("cancel") || "取消"}
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={saveConfigControl.loading}
                  >
                    {saveConfigControl.loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-1" />
                    )}
                    {t("confirm") || "确认"}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </MagicCard>
    </div>
  );
}
