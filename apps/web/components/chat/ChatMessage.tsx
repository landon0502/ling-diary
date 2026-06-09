"use client";

import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  status: ChatMessageProps["status"];
}

/**
 * AI 消息：靠左对齐，带头像，下方操作栏
 */
function AssistantMessage({
  message,
  onRegenerate,

  status,
}: AssistantMessageProps) {
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
          {status === "ready" && (
            <div className="mt-1.5 flex items-center gap-0.5">
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
            </div>
          )}
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
  status?: "submitted" | "streaming" | "ready" | "error";
}

/**
 * 根据消息角色分发到 UserMessage 或 AssistantMessage
 */
function ChatMessage({ message, onRegenerate, status }: ChatMessageProps) {
  if (message.role === "user") {
    return <UserMessage message={message} />;
  }

  return (
    <AssistantMessage
      message={message}
      onRegenerate={onRegenerate}
      status={status}
    />
  );
}

export { ChatMessage, MessageContent };
