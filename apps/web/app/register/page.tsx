"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  User,
  ArrowRight,
  CheckCircle2,
  Check,
  X,
} from "lucide-react";
import { Meteors } from "@/components/ui/meteors";
import { useMounted } from "@/hooks";
import { ThemeButton } from "@/components/theme/theme-button";
import useService from "./useServices";
export default function RegisterPage() {
  const router = useRouter();
  const mounted = useMounted();
  const { registerControl } = useService();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { runAsync, loading: isLoading } = registerControl;

  // 密码强度检测
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return "弱";
    if (passwordStrength === 3) return "中等";
    return "强";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-destructive";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    await runAsync({ username, password, email });
    router.push("/login");
  };

  const isStep1Valid = username.length >= 2 && email.includes("@");
  const isStep2Valid =
    passwordStrength >= 3 && password === confirmPassword && agreeTerms;

  return (
    <div className="min-h-screen bg-background flex">
      {/* 主题切换按钮 */}
      {mounted && <ThemeButton />}

      {/* 左侧品牌展示区 */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        {/* 多层背景效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-primary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        {/* 网格背景 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* 浮动粒子 */}
        <div className="absolute inset-0 overflow-hidden">
          <Meteors />
        </div>

        {/* 装饰性光晕 */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />

        {/* 内容区域 */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/50 blur-xl rounded-full" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              LingDiary
            </span>
          </div>

          {/* 标题 */}
          <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-4 leading-tight">
            开启你的
            <br />
            <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
              英语成长之路
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-md">
            加入 50,000+ 用户，用每日日记记录成长，让 AI 助你突破英语写作瓶颈
          </p>

          {/* 注册优势 */}
          <div className="space-y-4 max-w-md">
            {[
              {
                title: "免费开始",
                desc: "每天一篇免费 AI 批改，无需付费即可体验",
              },
              { title: "智能学习路径", desc: "根据你的水平定制专属学习计划" },
              { title: "成长可视化", desc: "详细的数据分析，见证每一步进步" },
              { title: "社区支持", desc: "与志同道合的学习者一起进步" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-card/30 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {item.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧注册表单区 */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* 移动端 Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/50 blur-xl rounded-full" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              LingDiary
            </span>
          </div>

          {/* 步骤指示器 */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                currentStep === 1
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs font-medium">
                {currentStep > 1 ? <Check className="w-3 h-3" /> : "1"}
              </div>
              <span className="text-sm font-medium">基本信息</span>
            </div>
            <div className="w-8 h-0.5 bg-border" />
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                currentStep === 2
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs font-medium">
                2
              </div>
              <span className="text-sm font-medium">设置密码</span>
            </div>
          </div>

          {/* 标题 */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {currentStep === 1 ? "创建你的账户" : "设置安全密码"}
            </h2>
            <p className="text-muted-foreground">
              {currentStep === 1
                ? "填写基本信息，开始你的英语学习之旅"
                : "设置一个强密码来保护你的账户安全"}
            </p>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {currentStep === 1 ? (
              <>
                {/* 用户名 */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    用户名
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="你的昵称"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-12 bg-input border-border focus:border-primary focus:ring-primary/20"
                      required
                    />
                    {username.length >= 2 && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    这将是你在社区中显示的名称
                  </p>
                </div>

                {/* 邮箱 */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    邮箱地址
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-input border-border focus:border-primary focus:ring-primary/20"
                      required
                    />
                    {email.includes("@") && email.includes(".") && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    我们会向此邮箱发送验证链接
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={!isStep1Valid}
                  className="w-full h-12 bg-gradient-to-r from-accent to-primary hover:opacity-90 text-primary-foreground font-medium relative overflow-hidden group disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    下一步
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </>
            ) : (
              <>
                {/* 密码 */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    密码
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="设置密码"
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

                  {/* 密码强度指示器 */}
                  {password && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${getPasswordStrengthColor()}`}
                            style={{
                              width: `${(passwordStrength / 4) * 100}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength <= 2
                              ? "text-destructive"
                              : passwordStrength === 3
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          {
                            check: passwordChecks.length,
                            text: "至少 8 个字符",
                          },
                          {
                            check: passwordChecks.uppercase,
                            text: "包含大写字母",
                          },
                          {
                            check: passwordChecks.lowercase,
                            text: "包含小写字母",
                          },
                          { check: passwordChecks.number, text: "包含数字" },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-1.5 ${
                              item.check
                                ? "text-green-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item.check ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <X className="w-3.5 h-3.5" />
                            )}
                            {item.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 确认密码 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    确认密码
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="再次输入密码"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 bg-input border-border focus:border-primary focus:ring-primary/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && (
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        password === confirmPassword
                          ? "text-green-500"
                          : "text-destructive"
                      }`}
                    >
                      {password === confirmPassword ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> 密码匹配
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" /> 密码不匹配
                        </>
                      )}
                    </p>
                  )}
                </div>

                {/* 服务条款 */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) =>
                      setAgreeTerms(checked as boolean)
                    }
                    className="mt-1"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    我已阅读并同意{" "}
                    <span className="text-primary hover:underline">
                      服务条款
                    </span>{" "}
                    和{" "}
                    <span className="text-primary hover:underline">
                      隐私政策
                    </span>
                  </Label>
                </div>

                {/* 按钮组 */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 h-12"
                  >
                    上一步
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isStep2Valid || isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-accent to-primary hover:opacity-90 text-primary-foreground font-medium relative overflow-hidden group disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          创建中...
                        </>
                      ) : (
                        <>
                          创建账户
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </div>
              </>
            )}
          </form>

          {/* 分隔线 */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                或使用以下方式注册
              </span>
            </div>
          </div>

          {/* 切换到登录 */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            已有账户？
            <Link
              href="/login"
              className="ml-1 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              立即登录
            </Link>
          </p>

          {/* 安全提示 */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>数据加密传输，安全可靠</span>
          </div>
        </div>
      </div>
    </div>
  );
}
