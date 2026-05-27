"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequest } from "ahooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BookOpen,
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  PenLine,
  Brain,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Meteors } from "@/components/ui/meteors";
import { useAuthStore } from "@/stores";
import { ThemeButton } from "@/components/theme/theme-button";
import { useMounted } from "@/hooks";
import { RainbowButton } from "@/components/ui/rainbow-button";

const REMEMBER_KEY = "ling-diary-remember";

export default function LoginPage() {
  const router = useRouter();
  const mounted = useMounted();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      return saved ? JSON.parse(saved).password ?? "" : "";
    } catch {
      return "";
    }
  });
  const [name, setName] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      return saved ? JSON.parse(saved).name ?? "" : "";
    } catch {
      return "";
    }
  });
  const [remember, setRemember] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(REMEMBER_KEY);
  });

  const {
    runAsync: doSubmit,
    loading,
    error: reqError,
  } = useRequest(
    async () => {
      const { login } = useAuthStore.getState();
      await login({ name, password, remember });
    },
    {
      manual: true,
      onSuccess: () => {
        if (remember) {
          localStorage.setItem(
            REMEMBER_KEY,
            JSON.stringify({ name, password })
          );
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }
        router.push("/");
      },
    }
  );

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!name.trim()) return;
    doSubmit();
  };

  const error = (reqError as { message?: string })?.message || null;

  const features = [
    { icon: PenLine, title: "每日英文日记", desc: "养成写作习惯" },
    { icon: Brain, title: "AI 智能评分", desc: "即时反馈指导" },
    { icon: Sparkles, title: "语法纠错", desc: "精准定位错误" },
    { icon: TrendingUp, title: "成长分析", desc: "可视化进步" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* 主题切换按钮 */}
      {mounted && <ThemeButton />}
      {/* 左侧品牌展示区 */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        {/* 多层背景效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />

        {/* 网格背景 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* 浮动粒子 */}
        <Meteors />

        {/* 装饰性光晕 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* 内容区域 */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              LingDiary
            </span>
          </div>

          {/* 标题 */}
          <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-4 leading-tight">
            用 AI 赋能你的
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
              英语写作之旅
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-md">
            每天写一篇英文日记，让 AI
            成为你的私人写作导师，见证你的英语能力稳步提升
          </p>

          {/* 功能亮点 */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">
                    {feature.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 用户数据 */}
          <div className="mt-12 flex items-center gap-8">
            <div>
              <div className="text-2xl font-bold text-foreground">50,000+</div>
              <div className="text-sm text-muted-foreground">活跃用户</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <div className="text-2xl font-bold text-foreground">2M+</div>
              <div className="text-sm text-muted-foreground">日记篇数</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <div className="text-2xl font-bold text-foreground">4.9</div>
              <div className="text-sm text-muted-foreground">用户评分</div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧登录表单区 */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* 移动端 Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              LingDiary
            </span>
          </div>

          {/* 标题 */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              欢迎回来
            </h2>
            <p className="text-muted-foreground">登录以继续你的英语学习之旅</p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                账号
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="输入用户名或邮箱地址"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 bg-input border-border focus:border-primary focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-input border-border focus:border-primary focus:ring-primary/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(v === true)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  记住我
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                忘记密码？
              </button>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox id="terms" className="mt-1" required />
              <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                我已阅读并同意 <span className="text-primary">服务条款</span> 和{" "}
                <span className="text-primary">隐私政策</span>
              </Label>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <RainbowButton
              type="submit"
              disabled={loading}
              variant="outline"
              className="w-full h-12"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-foreground">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    登录
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </RainbowButton>
          </form>

          {/* 分隔线 */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                或使用以下方式登录
              </span>
            </div>
          </div>

          {/* 切换登录/注册 */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            还没有账户？
            <button
              type="button"
              className="ml-1 text-primary hover:text-primary/80 font-medium transition-colors"
              onClick={() => router.push("/register")}
            >
              立即注册
            </button>
          </p>

          {/* 安全提示 */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>数据加密传输，安全可靠</span>
          </div>
        </div>
      </div>
    </div>
  );
}
