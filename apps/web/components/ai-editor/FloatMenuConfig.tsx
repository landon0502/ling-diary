import type { Editor, ChainedCommands } from "@tiptap/react";
import type { LucideIcon } from "lucide-react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

// ============================================================
// 类型定义
// ============================================================

/**
 * 菜单项配置接口
 *
 * 设计原则：
 * - 纯数据配置，不依赖 Editor 实例，方便静态定义
 * - 支持标准 TipTap 命令和自定义操作（如 AI 功能）
 * - 激活状态可自定义，默认从 command 自动推导
 *
 * 扩展方式：
 * - AI 按钮：设置 onAction 回调，isActive 返回 false
 * - 自定义编辑器命令：设置 command 和 params
 */
export interface MenuItemConfig {
  /** 唯一标识，用于 React key 和状态查找 */
  id: string;
  /** Lucide 图标组件引用 */
  icon: LucideIcon;
  /** 中文标签（Tooltip 显示） */
  label: string;
  /** TipTap 链式命令名，如 "toggleBold" */
  command?: string;
  /** 命令参数，如 { level: 1 } */
  params?: Record<string, unknown>;
  /** 自定义操作回调（优先级高于 command），用于 AI 等功能 */
  onAction?: (editor: Editor) => void;
  /** 自定义激活状态判断（优先级高于 command 自动推导） */
  isActive?: (editor: Editor) => boolean;
}

/**
 * 标题级别配置
 */
export interface HeadingItemConfig {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  icon: LucideIcon;
  label: string;
}

// ============================================================
// 菜单项配置数据
// ============================================================

/**
 * Bubble 菜单项 —— 选中文本时出现在选区附近
 * 目前包含：加粗、斜体、删除线
 *
 * 扩展点：可在此数组追加 AI 相关按钮，如：
 * { id: "ai-polish", icon: Sparkles, label: "AI 润色", onAction: (editor) => {...} }
 */
export const BUBBLE_MENU_ITEMS: MenuItemConfig[] = [
  {
    id: "bold",
    icon: Bold,
    label: "加粗",
    command: "toggleBold",
  },
  {
    id: "italic",
    icon: Italic,
    label: "斜体",
    command: "toggleItalic",
  },
  {
    id: "strike",
    icon: Strikethrough,
    label: "删除线",
    command: "toggleStrike",
  },
  {
    id: "language-marker",
    icon: Strikethrough,
    label: "标记",
    command: "setMark",
    params: {},
  },
];

/**
 * Floating 菜单项 —— 空行/段落开头时出现的块级操作
 * 目前包含：无序列表、有序列表、引用
 *
 * 标题操作因需要下拉选择级别，在组件中单独处理
 */
export const FLOATING_BLOCK_ITEMS: MenuItemConfig[] = [
  {
    id: "bulletList",
    icon: List,
    label: "无序列表",
    command: "toggleBulletList",
  },
  {
    id: "orderedList",
    icon: ListOrdered,
    label: "有序列表",
    command: "toggleOrderedList",
  },
  {
    id: "blockquote",
    icon: Quote,
    label: "引用",
    command: "toggleBlockquote",
  },
];

/**
 * 标题级别选项（用于下拉菜单）
 */
export const HEADING_ITEMS: HeadingItemConfig[] = [
  { level: 1, icon: Heading1, label: "标题 1" },
  { level: 2, icon: Heading2, label: "标题 2" },
  { level: 3, icon: Heading3, label: "标题 3" },
  { level: 4, icon: Heading4, label: "标题 4" },
  { level: 5, icon: Heading5, label: "标题 5" },
  { level: 6, icon: Heading6, label: "标题 6" },
];

// ============================================================
// 工具函数
// ============================================================

/**
 * 从配置项获取可执行的菜单操作回调
 * 优先级：onAction > command
 */
export function getMenuAction(
  editor: Editor,
  item: MenuItemConfig
): () => void {
  return () => {
    // 自定义操作优先
    if (item.onAction) {
      item.onAction(editor);
      return;
    }

    // 标准 TipTap 命令
    if (item.command) {
      const chain = editor.chain().focus();
      // TipTap 链式命令方法签名统一为 (...args) => ChainedCommands
      // 经过 unknown 中转是因为 ChainedCommands 自身的 run/tr 等方法与索引签名不兼容
      const cmdFn = (
        chain as unknown as Record<
          string,
          (...args: unknown[]) => ChainedCommands
        >
      )[item.command];
      if (typeof cmdFn === "function") {
        const result = item.params
          ? cmdFn.call(chain, item.params)
          : cmdFn.call(chain);
        result?.run();
      }
    }
  };
}
