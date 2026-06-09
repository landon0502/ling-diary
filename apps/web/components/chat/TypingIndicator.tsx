"use client";

import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  /** 自定义类名 */
  className?: string;
}

/**
 * AI 回复时的打字指示器动效
 * - 三个依次弹跳的圆点
 * - 放在 AI 消息区的左侧，模拟 Avatar 后的气泡位置
 */
function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn("flex items-center gap-3 px-4 py-2", className)}
      role="status"
      aria-label="AI 正在回复中"
    >
      {/* 弹跳圆点 */}
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted/80 px-4 py-3">
        <span
          className="size-2 rounded-full bg-muted-foreground/50"
          style={{ animation: "typing-dot 1.4s ease-in-out infinite" }}
        />
        <span
          className="size-2 rounded-full bg-muted-foreground/50"
          style={{
            animation: "typing-dot 1.4s ease-in-out 0.2s infinite",
          }}
        />
        <span
          className="size-2 rounded-full bg-muted-foreground/50"
          style={{
            animation: "typing-dot 1.4s ease-in-out 0.4s infinite",
          }}
        />
      </div>

      {/* 内联关键帧动画 */}
      <style jsx>{`
        @keyframes typing-dot {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export { TypingIndicator };
