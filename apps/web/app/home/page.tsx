import {
  Sparkles,
  PenLine,
  Target,
  Award,
  ArrowRight,
  Zap,
  TrendingUp,
  BookOpen,
  Flame,
  Star,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "./components";
import { FloatingParticles } from "@/components/floating-particles";

function HomeContent() {
  return (
    <div className="space-y-8 relative">
      {/* Hero Section - 全新设计 */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20">
        {/* 多层渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />

        {/* 动态光晕 */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div
          className="absolute bottom-0 left-1/4 w-72 h-72 bg-accent/20 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* 网格背景 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <FloatingParticles />

        <div className="relative z-10 p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* 左侧内容 */}
            <div className="flex-1 text-center lg:text-left">
              {/* 标签 */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 transition-all duration-700 opacity-100 translate-y-0`}
              >
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  AI 驱动的智能学习
                </span>
              </div>

              {/* 主标题 */}
              <h1
                className={`text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight transition-all duration-700 delay-100 opacity-100 translate-y-0`}
              >
                <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
                  用英文记录生活
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  让 AI 见证成长
                </span>
              </h1>

              {/* 描述 */}
              <p
                className={`text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0 transition-all duration-700 delay-200 opacity-100 translate-y-0`}
              >
                每日英文日记 + AI
                智能反馈，从语法纠错到表达优化，让每一次写作都成为进步的契机
              </p>

              {/* 按钮组 */}
              <div
                className={`flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start transition-all duration-700 delay-300 opacity-100 translate-y-0`}
              >
                <Button
                  size="lg"
                  className="gap-2 text-base px-8 h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                >
                  <PenLine className="w-5 h-5" />
                  开始今日日记
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 text-base px-8 h-12 rounded-xl border-primary/30 hover:bg-primary/10"
                >
                  <BookOpen className="w-5 h-5" />
                  查看示例
                </Button>
              </div>
            </div>

            {/* 右侧统计卡片 */}
            <div
              className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-400 opacity-100 translate-x-0`}
            >
              {[
                {
                  icon: Flame,
                  label: "连续打卡",
                  value: 15,
                  suffix: "天",
                  color: "from-orange-500 to-red-500",
                },
                {
                  icon: TrendingUp,
                  label: "本周提升",
                  value: 12,
                  suffix: "%",
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  icon: Star,
                  label: "累计词汇",
                  value: 2847,
                  suffix: "",
                  color: "from-amber-500 to-yellow-500",
                },
                {
                  icon: Target,
                  label: "平均分数",
                  value: 82,
                  suffix: "分",
                  color: "from-primary to-accent",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group relative p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all hover:scale-105 w-28"
                >
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <stat.icon
                    className={`w-5 h-5 mb-2 bg-gradient-to-br ${stat.color} bg-clip-text`}
                    style={{
                      color: "transparent",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                  <div className="text-2xl font-bold text-foreground">
                    <AnimatedNumber target={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 功能展示 - Bento Grid 风格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 大卡片 - AI 智能评分 */}
        <Card className="md:col-span-2 lg:row-span-2 group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 lg:p-8 h-full flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              AI 智能评分
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
              多维度评估你的英文写作：语法准确性、词汇丰富度、表达流畅度、逻辑连贯性。每篇日记都能获得客观分数和个性化改进建议。
            </p>
            {/* 模拟评分展示 */}
            <div className="space-y-3">
              {[
                { name: "语法", score: 85, color: "bg-emerald-500" },
                { name: "词汇", score: 72, color: "bg-amber-500" },
                { name: "流畅度", score: 90, color: "bg-primary" },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-foreground font-medium">
                      {item.score}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                      style={{ width: item.score }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 语法纠错 */}
        <Card className="group relative overflow-hidden border-border/50 hover:border-success/30 transition-all">
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                "linear-gradient(to bottom right, hsl(var(--success) / 0.05), transparent)",
            }}
          />
          <CardContent className="p-6 h-full flex flex-col">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: "hsl(var(--success) / 0.1)" }}
            >
              <Sparkles
                className="w-6 h-6"
                style={{ color: "hsl(var(--success))" }}
              />
            </div>
            <h3 className="font-bold text-foreground mb-2">语法纠错</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              实时检测语法、拼写错误，提供详细解释
            </p>
            <div
              className="mt-4 p-3 rounded-lg border"
              style={{
                backgroundColor: "hsl(var(--success) / 0.05)",
                borderColor: "hsl(var(--success) / 0.2)",
              }}
            >
              <div className="text-xs font-mono">
                <span className="line-through text-destructive/70">I goed</span>
                <span className="text-success ml-2">I went</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 改写建议 */}
        <Card className="group relative overflow-hidden border-border/50 hover:border-accent/30 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 h-full flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold text-foreground mb-2">改写建议</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              AI 提供更地道、更优雅的表达方式
            </p>
            <div className="mt-4 p-3 rounded-lg bg-accent/5 border border-accent/20">
              <div className="text-xs">
                <span className="text-muted-foreground">{'"very good"'}</span>
                <span className="mx-2">→</span>
                <span className="text-accent font-medium">
                  {'"exceptional"'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 成长追踪 */}
        <Card className="group relative overflow-hidden border-border/50 hover:border-warning/30 transition-all">
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                "linear-gradient(to bottom right, hsl(var(--warning) / 0.05), transparent)",
            }}
          />
          <CardContent className="p-6 h-full flex flex-col">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: "hsl(var(--warning) / 0.1)" }}
            >
              <Award
                className="w-6 h-6"
                style={{ color: "hsl(var(--warning))" }}
              />
            </div>
            <h3 className="font-bold text-foreground mb-2">成长追踪</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              可视化展示长期学习趋势，让进步看得见
            </p>
            {/* 迷你趋势图 */}
            <div className="mt-4 flex items-end gap-1 h-8">
              {[40, 55, 45, 65, 70, 60, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all duration-500"
                  style={{
                    backgroundColor: "hsl(var(--warning) / 0.6)",
                    height: `${h}%`,
                    transitionDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 词汇积累 */}
        <Card className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 h-full flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">词汇积累</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              自动收集新学词汇，构建个人词库
            </p>
            <div className="mt-4 flex flex-wrap gap-1">
              {["serendipity", "eloquent", "persevere"].map((word, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20"
                >
                  {word}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近动态 - 时间线风格 */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">最近动态</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            {/* 时间线 */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-primary via-success to-warning rounded-full" />

            <div className="space-y-6">
              {[
                {
                  action: "完成日记",
                  detail: "《A Sunny Day》获得 85 分",
                  time: "2 小时前",
                  color: "bg-primary",
                  badge: "+85",
                },
                {
                  action: "达成成就",
                  detail: "连续写作 7 天，获得「坚持之星」徽章",
                  time: "昨天",
                  color: "bg-warning",
                  badge: "徽章",
                },
                {
                  action: "词汇解锁",
                  detail: "新增 12 个高级词汇到个人词库",
                  time: "昨天",
                  color: "bg-success",
                  badge: "+12",
                },
                {
                  action: "完成日记",
                  detail: "《Weekend Trip》获得 78 分",
                  time: "2 天前",
                  color: "bg-primary",
                  badge: "+78",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 pl-6 transition-all duration-500 opacity-100 translate-x-0`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`absolute left-0 w-4 h-4 rounded-full ${item.color} ring-4 ring-background`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">
                        {item.action}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          item.color === "bg-primary"
                            ? "bg-primary/10 text-primary"
                            : item.color === "bg-warning"
                            ? "bg-warning/10 text-warning"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.detail}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HomeView() {
  return <HomeContent />;
}
