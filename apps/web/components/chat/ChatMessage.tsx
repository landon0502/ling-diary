"use client";

import { useState, useCallback, useMemo } from "react";
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Message } from "./types";

/**
 * 将消息文本解析为段落 + 代码块的混合内容
 * - 以 ``` 为分隔符，偶数索引为普通文本，奇数索引为代码块
 * - 代码块第一行可能包含语言标识（如 ```typescript）
 */
function MessageContent({ parts }: Readonly<Pick<Message, "parts">>) {
  const segments = useMemo(() => {
    return parts.map((part, index) => {
      if (part.type === "text") {
        return (
          <p key={index} className="leading-relaxed whitespace-pre-wrap">
            {part.text}
          </p>
        );
      }
    });
  }, [parts]);

  return <>{segments}</>;
}

/* ============================================================
 * 用户消息气泡
 * ============================================================ */

interface UserMessageProps {
  message: Message;
}

/**
 * 用户消息：靠右对齐，使用 Card + 微弱阴影
 */
function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex justify-end px-4 py-3">
      <div className="max-w-[80%] md:max-w-[70%]">
        <Card
          size="sm"
          className="rounded-2xl rounded-br-md border-0 bg-primary/8 px-4 py-2.5 shadow-sm ring-0 dark:bg-primary/15"
        >
          <div className="text-sm text-foreground">
            <MessageContent parts={message.parts} />
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
 * AI 消息气泡
 * ============================================================ */

interface AssistantMessageProps {
  message: Message;
  /** 重新生成回调 */
  onRegenerate?: (messageId: string) => void;
  /** 赞/踩反馈回调 */
  onFeedback?: (messageId: string, type: "up" | "down") => void;
}

/**
 * AI 消息：靠左对齐，带头像，下方操作栏
 */
function AssistantMessage({
  message,
  onRegenerate,
  onFeedback,
}: AssistantMessageProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  /** 复制整条消息 */
  const handleCopyMessage = useCallback(async () => {
    // try {
    //   await navigator.clipboard.writeText(message.content);
    //   setCopied(true);
    //   setTimeout(() => setCopied(false), 2000);
    // } catch {
    //   // 降级
    //   const textarea = document.createElement("textarea");
    //   textarea.value = message.content;
    //   textarea.style.position = "fixed";
    //   textarea.style.opacity = "0";
    //   document.body.appendChild(textarea);
    //   textarea.select();
    //   document.execCommand("copy");
    //   document.body.removeChild(textarea);
    //   setCopied(true);
    //   setTimeout(() => setCopied(false), 2000);
    // }
  }, [message]);

  /** 赞/踩 */
  const handleFeedback = useCallback(
    (type: "up" | "down") => {
      const newVal = feedback === type ? null : type;
      setFeedback(newVal);
      if (newVal) onFeedback?.(message.id, newVal);
    },
    [feedback, message.id, onFeedback]
  );

  return (
    <div className="px-4 py-3">
      <div className="mx-auto flex max-w-3xl gap-3">
        {/* 消息内容 + 操作栏 */}
        <div className="min-w-0 flex-1">
          {/* 消息正文 */}
          <div className="text-sm leading-relaxed text-foreground">
            <MessageContent parts={message.parts} />
          </div>

          {/* 操作栏 */}
          <div className="mt-1.5 flex items-center gap-0.5">
            {/* 复制 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  onClick={handleCopyMessage}
                  aria-label={copied ? "已复制" : "复制回复"}
                >
                  {copied ? (
                    <Check className="size-3.5 text-green-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {copied ? "已复制!" : "复制"}
              </TooltipContent>
            </Tooltip>

            {/* 重新生成 */}
            {onRegenerate && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="size-7 text-muted-foreground hover:text-foreground"
                    onClick={() => onRegenerate(message.id)}
                    aria-label="重新生成"
                  >
                    <RotateCcw className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">重新生成</TooltipContent>
              </Tooltip>
            )}

            {/* 分隔线 */}
            <span className="mx-1 h-3.5 w-px bg-border" aria-hidden />

            {/* 赞 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className={cn(
                    "size-7 transition-colors",
                    feedback === "up"
                      ? "text-green-500"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => handleFeedback("up")}
                  aria-label="赞"
                  aria-pressed={feedback === "up"}
                >
                  <ThumbsUp className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {feedback === "up" ? "取消赞" : "赞"}
              </TooltipContent>
            </Tooltip>

            {/* 踩 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className={cn(
                    "size-7 transition-colors",
                    feedback === "down"
                      ? "text-red-500"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => handleFeedback("down")}
                  aria-label="踩"
                  aria-pressed={feedback === "down"}
                >
                  <ThumbsDown className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {feedback === "down" ? "取消踩" : "踩"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * 统一消息渲染入口
 * ============================================================ */

interface ChatMessageProps {
  message: Message;
  onRegenerate?: (messageId: string) => void;
  onFeedback?: (messageId: string, type: "up" | "down") => void;
}

/**
 * 根据消息角色分发到 UserMessage 或 AssistantMessage
 */
function ChatMessage({ message, onRegenerate, onFeedback }: ChatMessageProps) {
  if (message.role === "user") {
    return <UserMessage message={message} />;
  }

  return (
    <AssistantMessage
      message={message}
      onRegenerate={onRegenerate}
      onFeedback={onFeedback}
    />
  );
}

export { ChatMessage, MessageContent };
