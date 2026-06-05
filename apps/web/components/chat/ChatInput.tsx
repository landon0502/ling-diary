"use client";

import { useRef, useCallback, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  /** 输入框当前值 */
  value: string;
  /** 输入变化回调 */
  onChange: (value: string) => void;
  /** 发送回调 */
  onSend: () => void;
  /** 是否正在加载（加载时禁用发送） */
  isLoading?: boolean;
  /** 是否禁用输入 */
  disabled?: boolean;
  /** 自定义 placeholder */
  placeholder?: string;
  /** 文件上传回调（预留） */
  onFileUpload?: (files: FileList) => void;
  /** 图片上传回调（预留） */
  onImageUpload?: (files: FileList) => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 聊天底部输入区
 * - 多行 Textarea，高度自适应（field-sizing-content）
 * - Enter 发送 / Shift+Enter 换行
 * - 左侧：附件 & 图片上传图标
 * - 右侧：发送按钮（空值时置灰，有内容时激活高亮）
 */
function ChatInput({
  value,
  onChange,
  onSend,
  isLoading = false,
  disabled = false,
  placeholder = "输入消息...",
  onImageUpload,
  className,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isDisabled = disabled || isLoading;
  const canSend = value.trim().length > 0 && !isDisabled;

  /** 处理键盘事件：Enter 发送，Shift+Enter 换行 */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (canSend) {
          onSend();
        }
      }
    },
    [canSend, onSend]
  );

  /** 发送后自动聚焦 */
  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend();
    // 延迟 focus，等状态更新后
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, [canSend, onSend]);

  /** 处理图片上传 */
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onImageUpload?.(e.target.files);
        e.target.value = "";
      }
    },
    [onImageUpload]
  );

  return (
    <div
      className={cn(
        "border-t border-border/50 bg-background/80 px-4 py-3 backdrop-blur-sm",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
        {/* 左侧：上传图标区域 */}
        <div className="flex shrink-0 items-center gap-1 pb-1">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleImageChange}
            tabIndex={-1}
          />
        </div>

        {/* 中间：输入框 */}
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isDisabled}
            rows={1}
            className="min-h-10 resize-none border-0 bg-muted/60 px-3 py-2 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
            aria-label="消息输入框"
          />
        </div>

        {/* 右侧：发送按钮 */}
        <div className="flex shrink-0 items-center pb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!canSend}
                className={cn(
                  "size-9 rounded-xl transition-all duration-200",
                  canSend
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    : "bg-muted text-muted-foreground"
                )}
                aria-label="发送消息"
              >
                <ArrowUp className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {canSend ? "发送 (⏎)" : "输入内容后发送"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* 底部提示文字 */}
      <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-muted-foreground/60">
        AI 生成内容仅供参考，请自行核实重要信息
      </p>
    </div>
  );
}

export { ChatInput };
