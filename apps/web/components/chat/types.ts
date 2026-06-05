import type { UIMessage } from "@ai-sdk/react";
/**
 * 聊天组件共享类型定义
 */

/** 单条消息 */
// export interface Message {
//   /** 唯一标识 */
//   id: string;
//   /** 角色：用户 / AI 助手 */
//   role: "user" | "assistant";
//   /** 消息文本内容（支持 markdown 代码块） */
//   content: string;
//   /** 时间戳（毫秒） */
//   timestamp: number;
// }
export type Message = UIMessage;

/** 预设提示词 */
export interface PresetPrompt {
  /** 唯一标识 */
  id: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 点击后填入输入框的内容 */
  prompt: string;
}

/** AiChat 组件对外 Props */
export interface AiChatProps {
  systemContent?: string;
  /** 初始消息列表 */
  initialMessages?: Message[];
  /** 外部控制加载状态 */
  isLoading?: boolean;
  /** 发送消息回调（对接业务 API） */
  onSend?: (content: string) => void;
  /** 清空对话回调 */
  onClear?: () => void;
  /** 重新生成回调 */
  onRegenerate?: (messageId: string) => void;
  /** 赞/踩反馈回调 */
  onFeedback?: (messageId: string, type: "up" | "down") => void;
  /** 自定义预设提示词 */
  presetPrompts?: PresetPrompt[];
  /** 自定义品牌 Logo */
  logo?: React.ReactNode;
  /** 欢迎标题 */
  welcomeTitle?: string;
  /** 自定义类名 */
  className?: string;
}
