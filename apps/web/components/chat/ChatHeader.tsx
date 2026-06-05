"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatHeaderProps {
  /** 清空对话回调 */
  onClear: () => void;
  /** 是否有消息（无消息时禁用清空） */
  hasMessages: boolean;
}

/**
 * 聊天顶部 Header
 * - 左侧：AI 模型选择器（Shadcn Select）
 * - 右侧：清空对话按钮（Ghost Button + Trash 图标）
 */
function ChatHeader({ onClear, hasMessages }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-end border-b border-border/50 bg-background/80 px-4 backdrop-blur-sm">
      {/* 右侧：清空对话 */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            disabled={!hasMessages}
            className="size-8 text-muted-foreground hover:text-destructive"
            aria-label="清空对话"
          >
            <Trash2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">清空对话</TooltipContent>
      </Tooltip>
    </header>
  );
}

export { ChatHeader };
