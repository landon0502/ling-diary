"use client";

import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import { useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import {
  Heading,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  BUBBLE_MENU_ITEMS,
  FLOATING_BLOCK_ITEMS,
  HEADING_ITEMS,
  getMenuAction,
  type MenuItemConfig,
} from "./FloatMenuConfig";

// ============================================================
// 样式常量
// ============================================================

/**
 * 浮动菜单容器统一样式
 * 匹配 Shadcn DropdownMenu/Popover 的设计语言：
 * - bg-popover + text-popover-foreground：语义化颜色，自动适配深色模式
 * - shadow-md + ring-1：轻微阴影 + 极细边框，提升层次感
 * - rounded-lg + p-1：Shadcn 标准圆角和内边距
 */
const MENU_CONTAINER_CLASS = cn(
  "flex items-center gap-0.5",
  "rounded-lg border border-border/50",
  "bg-popover text-popover-foreground",
  "shadow-md",
  "p-1",
  "select-none"
);

// ============================================================
// 子组件
// ============================================================

/**
 * 单个菜单按钮
 *
 * 复用 MenusBar 中的 ToolbarToggle 设计模式：
 * - ghost variant：平时无背景，hover 显示
 * - size-8：32px 正方形，与 MenusBar 按钮一致
 * - 激活态 bg-muted：与 MenusBar 的激活样式保持一致
 */
function MenuButton({
  editor,
  item,
  isActive,
}: {
  editor: Editor;
  item: MenuItemConfig;
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-8", isActive && "bg-muted text-foreground")}
          onClick={getMenuAction(editor, item)}
          aria-label={item.label}
        >
          <Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{item.label}</TooltipContent>
    </Tooltip>
  );
}

/**
 * 标题级别下拉选择器
 *
 * 设计说明：
 * - 触发器显示当前标题级别图标 + ChevronDown 箭头
 * - 下拉内容列出 H1-H6，选中项显示 Check 标记
 * - 激活状态由 FloatMenu 父组件通过 useEditorState 计算后传入
 */
function HeadingDropdown({
  editor,
  headingLevel,
}: {
  editor: Editor;
  headingLevel: number;
}) {
  const activeItem = HEADING_ITEMS.find((h) => h.level === headingLevel);
  const TriggerIcon = activeItem?.icon ?? Heading;
  const isActive = headingLevel > 0;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "size-8",
                isActive && "bg-muted text-foreground"
              )}
              aria-label="标题"
            >
              <TriggerIcon className="size-4" />
              <ChevronDown className="size-3 -ml-0.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">
          {activeItem ? activeItem.label : "标题"}
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" side="top" className="min-w-36">
        {HEADING_ITEMS.map((item) => {
          const Icon = item.icon;
          const isItemActive = headingLevel === item.level;
          return (
            <DropdownMenuItem
              key={item.level}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({
                    level: item.level,
                  })
                  .run()
              }
              className="justify-between"
            >
              <Icon className="size-4" />
              <span className="text-xs text-muted-foreground ml-2">
                {item.label}
              </span>
              {isItemActive && <Check className="size-4 ml-auto" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================
// 主组件
// ============================================================

/**
 * FloatMenu —— 编辑器浮动菜单
 *
 * 包含两个 TipTap 菜单扩展：
 * 1. BubbleMenu：选中文本时在选区附近弹出（加粗、斜体、删除线）
 * 2. FloatingMenu：空行/段落开头时弹出（标题、列表、引用）
 *
 * 状态管理：
 * - 使用 useEditorState 订阅编辑器状态，仅在实际变化时重渲染
 * - selector 中计算所有需要的激活状态，避免多次 isActive 调用
 *
 * 扩展指南：
 * - 添加新菜单项：在 FloatMenuConfig.tsx 的对应数组中追加
 * - 添加 AI 按钮：设置 onAction 回调 + isActive: () => false
 * - 添加新按钮组：在对应 Menu 容器中追加渲染逻辑
 */
export default function FloatMenu({
  editor,
}: Readonly<{
  editor: Editor;
}>) {
  // 通过 selector 订阅编辑器状态，仅在相关状态变化时触发重渲染
  const menuState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx?.editor) return null;
      const e = ctx.editor;

      // 计算当前激活的标题级别
      const headingLevels = [1, 2, 3, 4, 5, 6] as const;
      const headingLevel =
        headingLevels.find((lvl) => e.isActive("heading", { level: lvl })) ?? 0;

      return {
        headingLevel,
        isBold: e.isActive("bold"),
        isItalic: e.isActive("italic"),
        isStrike: e.isActive("strike"),
        isBulletList: e.isActive("bulletList"),
        isOrderedList: e.isActive("orderedList"),
        isBlockquote: e.isActive("blockquote"),
      };
    },
  });

  // 将状态映射为以 id 为 key 的查找表，方便菜单项获取激活状态
  const activeStateMap: Record<string, boolean> = menuState
    ? {
        bold: menuState.isBold,
        italic: menuState.isItalic,
        strike: menuState.isStrike,
        bulletList: menuState.isBulletList,
        orderedList: menuState.isOrderedList,
        blockquote: menuState.isBlockquote,
      }
    : {};

  return (
    <>
      {/* ================================================================ */}
      {/* BubbleMenu：选中文本时在选区附近弹出                             */}
      {/* 场景：选中一段文字后，提供加粗/斜体/删除线等行内格式操作         */}
      {/* ================================================================ */}
      {editor && (
        <BubbleMenu editor={editor} className={MENU_CONTAINER_CLASS}>
          {BUBBLE_MENU_ITEMS.map((item) => (
            <MenuButton
              key={item.id}
              editor={editor}
              item={item}
              isActive={activeStateMap[item.id] ?? false}
            />
          ))}
        </BubbleMenu>
      )}

      {/* ================================================================ */}
      {/* FloatingMenu：空行/段落开头时弹出                                 */}
      {/* 场景：在新段落开头，提供标题级别、列表、引用等块级格式操作       */}
      {/* ================================================================ */}
      {editor && (
        <FloatingMenu editor={editor} className={MENU_CONTAINER_CLASS}>
          {/* 标题下拉选择器 */}
          <HeadingDropdown
            editor={editor}
            headingLevel={menuState?.headingLevel ?? 0}
          />

          {/* 分隔线：标题 | 块级格式 */}
          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* 块级格式按钮组 */}
          {FLOATING_BLOCK_ITEMS.map((item) => (
            <MenuButton
              key={item.id}
              editor={editor}
              item={item}
              isActive={activeStateMap[item.id] ?? false}
            />
          ))}
        </FloatingMenu>
      )}
    </>
  );
}
