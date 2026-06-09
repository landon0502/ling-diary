"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn, generateId } from "@/lib/utils";
import type { Message, PresetPrompt, AiChatProps } from "./types";
import { ChatHeader } from "./ChatHeader";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { useChat } from "@ai-sdk/react"; // 💡 导入核心钩子
import { DefaultChatTransport } from "ai";
import { tokenManager } from "@/lib/fetch";
import { last } from "lodash";

/* ============================================================
 * AiChat 主组件
 * ============================================================ */

/**
 * AI 聊天组件
 * - 风格：ChatGPT/Claude 现代化极简 Dashboard 聊天
 * - 支持深色/浅色模式适配
 * - 模块化子组件：ChatHeader / ChatEmptyState / ChatMessage / ChatInput / TypingIndicator
 */
function AiChat({
  systemContent,
  systemTitle,
  onClear,
  presetPrompts,
  logo,
  welcomeTitle,
  className,
}: AiChatProps) {
  const [inputValue, setInputValue] = useState("");

  /* ---------- 引用 ---------- */
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // 💡 核心魔法：一行代码托管所有状态
  const { messages, sendMessage, stop, status, regenerate, setMessages } =
    useChat({
      // 50ms节流，平衡流畅性和性能
      experimental_throttle: 50,
      transport: new DefaultChatTransport({
        api: "/api/ai/chat",
        // 💡 核心：在新版中，通过自定义 fetch 来动态拦截并注入 Authorization Header
        fetch: async (url, options) => {
          let modifiedBody = options?.body;
          if (options?.body) {
            try {
              // 先把 useChat 默认生成的 { messages: [...] } 解析出来
              const originalPayload = JSON.parse(options.body.toString());

              // 强行塞入你需要的自定义参数（日记数据、配置等）
              const enhancedPayload = {
                ...originalPayload,
                systemTitle: systemTitle,
                systemContent: systemContent, // 自定义参数1：日记原文
                systemContentId: generateId(), // 自定义参数2：日记ID
                foo: "bar", // 任意你需要的其他字段
              };

              // 重新序列化为字符串重新赋给 body
              modifiedBody = JSON.stringify(enhancedPayload);
            } catch (e) {
              console.error("解析或拼装自定义请求体失败:", e);
            }
          }

          // 从本地存储或 Cookie 中获取你的用户 Token
          const token = tokenManager.getToken();

          const headers = new Headers(options?.headers);
          if (token) {
            headers.set("Authorization", `Bearer ${token}`); // 塞入鉴权 Token
          }

          return fetch(url, {
            ...options,
            headers,
            body: modifiedBody,
          });
        },
      }),
      onFinish: (message) => {
        // 记录分析数据
        console.log("完成了", message);
      },
      // 💡 极其重要：因为你的 FastAPI 吐出来的是 data: {"data": "..."}
      // 如果没有使用 Vercel AI SDK 的后端依赖，将流协议设为 'text' 意味着告诉它：
      // “请不要用 Vercel 默认的复杂协议，把我当成纯文本流/SSE 流逐块解析即可”。
      onError: (error) => {
        console.error("AI 聊天流发生错误:", error);
      },
    });
  const isLoading = useMemo(() => {
    const lastMsg = last(messages);
    const lastParts = lastMsg?.parts || [];
    const lastPart = lastParts[0];
    return (
      status === "submitted" ||
      (lastParts.length <= 1 && lastPart?.type === "text" && !lastPart.text)
    );
  }, [status, messages]);
  /* ---------- 自动滚动到底部 ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log(messages);
  }, [messages, isLoading]);

  /* ---------- 判断是否有消息 ---------- */
  const hasMessages = messages.length > 0;

  /* ---------- 发送消息 ---------- */
  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    sendMessage({ text: trimmed });
  }, [inputValue, sendMessage]);

  /* ---------- 清空对话 ---------- */
  const handleClear = useCallback(() => {
    setInputValue("");
    onClear?.();
    setMessages([]);
  }, [onClear, setMessages]);

  /* ---------- 预设提示词点击 ---------- */
  const handlePromptClick = useCallback((prompt: string) => {
    setInputValue(prompt);
  }, []);

  /* ---------- 文件/图片上传（占位） ---------- */
  const handleFileUpload = useCallback((files: FileList) => {
    // TODO: 对接业务文件上传逻辑
    const names = Array.from(files)
      .map((f) => f.name)
      .join(", ");
    setInputValue((prev) => `${prev}[上传文件: ${names}]`);
  }, []);

  const handleImageUpload = useCallback((files: FileList) => {
    // TODO: 对接业务图片上传逻辑
    const names = Array.from(files)
      .map((f) => f.name)
      .join(", ");
    setInputValue((prev) => `${prev}[上传图片: ${names}]`);
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "relative flex h-full flex-col bg-slate-50 dark:bg-background",
          className
        )}
      >
        {/* ========== 顶部 Header ========== */}
        <ChatHeader onClear={handleClear} hasMessages={hasMessages} />

        {/* ========== 中间聊天区（可滚动） ========== */}
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          {!hasMessages && !isLoading ? (
            /* ---- 空状态 ---- */
            <ChatEmptyState
              prompts={presetPrompts}
              logo={logo}
              welcomeTitle={welcomeTitle}
              onPromptClick={handlePromptClick}
            />
          ) : (
            /* ---- 消息列表 ---- */
            <div className="w-full">
              {messages.map((message, index, arr) => {
                return (
                  <div key={message.id}>
                    {/* ---- 加载中：打字指示器 ---- */}
                    {isLoading &&
                      message.role === "assistant" &&
                      index === arr.length - 1 && <TypingIndicator />}
                    <ChatMessage
                      message={message}
                      status={status}
                      onRegenerate={(messageId) => regenerate({ messageId })}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* 滚动锚点 */}
          <div ref={bottomRef} />
        </div>

        {/* ========== 底部输入区 ========== */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isLoading={isLoading}
          onFileUpload={handleFileUpload}
          onImageUpload={handleImageUpload}
        />
      </div>
    </TooltipProvider>
  );
}

export { AiChat };
export type { AiChatProps, Message, PresetPrompt };
