"use client";

import { Sparkles } from "lucide-react";
import type { PresetPrompt } from "./types";

interface ChatEmptyStateProps {
  /** 自定义预设提示词（不传使用默认） */
  prompts?: PresetPrompt[];
  /** 自定义 Logo */
  logo?: React.ReactNode;
  /** 欢迎标题 */
  welcomeTitle?: string;
  /** 点击预设提示词的回调 */
  onPromptClick: (prompt: string) => void;
}

/**
 * 聊天空状态页
 * - 品牌 Logo + 欢迎语
 * - 3~4 个预设 Prompt 快捷卡片
 * - 点击卡片将对应 prompt 文本填入输入框
 */
function ChatEmptyState({
  logo,
  welcomeTitle = "有什么可以帮助你的？",
}: ChatEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      {/* 品牌 Logo */}
      <div className="mb-6">
        {logo || (
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Sparkles className="size-7 text-primary" />
          </div>
        )}
      </div>

      {/* 欢迎语 */}
      <h2 className="mb-8 text-center text-xl font-semibold text-foreground">
        {welcomeTitle}
      </h2>
    </div>
  );
}

export { ChatEmptyState };
