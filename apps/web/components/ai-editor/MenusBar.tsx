"use client";

import { useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
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
interface ToolbarAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
  isActive: boolean;
  disabled?: boolean;
}

function ToolbarToggle({ item }: { item: ToolbarAction }) {
  const Icon = item.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={item.action}
          disabled={item.disabled}
          className={cn("size-8", item.isActive && "bg-muted text-foreground")}
          aria-label={item.label}
        >
          <Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{item.label}</TooltipContent>
    </Tooltip>
  );
}

export default function MenusBar({
  editor,
}: Readonly<{
  editor: Editor;
}>) {
  // TipTap 官方 React 模式：通过 selector 订阅响应式状态
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (ctx && ctx.editor) {
        const editor = ctx.editor;
        const headingLevels = [1, 2, 3, 4, 5, 6] as const;
        const activeHeading = headingLevels.find((lvl) =>
          editor.isActive("heading", { level: lvl })
        );
        return {
          headingLevel: activeHeading ?? 0,
          isBold: editor.isActive("bold"),
          isItalic: editor.isActive("italic"),
          isBulletList: editor.isActive("bulletList"),
          isOrderedList: editor.isActive("orderedList"),
          isBlockquote: editor.isActive("blockquote"),
          canUndo: editor.can().undo(),
          canRedo: editor.can().redo(),
        };
      }
    },
  });
  const HEADING_ITEMS = [
    { level: 1, icon: Heading1 },
    { level: 2, icon: Heading2 },
    { level: 3, icon: Heading3 },
    { level: 4, icon: Heading4 },
    { level: 5, icon: Heading5 },
    { level: 6, icon: Heading6 },
  ] as const;

  const activeHeadingItem = HEADING_ITEMS.find(
    (h) => h.level === editorState?.headingLevel
  );
  const TriggerIcon = activeHeadingItem?.icon ?? Heading;

  const markActions: ToolbarAction[] = [
    {
      icon: Bold,
      label: "加粗",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editorState?.isBold ?? false,
    },
    {
      icon: Italic,
      label: "斜体",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editorState?.isItalic ?? false,
    },
  ];

  const blockActions: ToolbarAction[] = [
    {
      icon: List,
      label: "无序列表",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editorState?.isBulletList ?? false,
    },
    {
      icon: ListOrdered,
      label: "有序列表",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editorState?.isOrderedList ?? false,
    },
    {
      icon: Quote,
      label: "引用",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editorState?.isBlockquote ?? false,
    },
  ];

  const historyActions: ToolbarAction[] = [
    {
      icon: Undo2,
      label: "撤销",
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      disabled: !editorState?.canUndo,
    },
    {
      icon: Redo2,
      label: "重做",
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      disabled: !editorState?.canRedo,
    },
    {
      icon: Redo2,
      label: "标注",
      action: () =>
        editor
          .chain()
          .focus()
          .setMark("comment", {
            commentId: "cmt_001",
          })
          .run(),
      isActive: false,
    },
  ];
  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-8",
                  editorState?.headingLevel &&
                    editorState.headingLevel > 0 &&
                    "bg-muted text-foreground"
                )}
              >
                <TriggerIcon className="size-4" />
                <ChevronDown className="size-3 -ml-0.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {activeHeadingItem
              ? `Heading ${activeHeadingItem.level}`
              : "Heading"}
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="min-w-28">
          {HEADING_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = editorState?.headingLevel === item.level;
            return (
              <DropdownMenuItem
                key={item.level}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({
                      level: item.level as 1 | 2 | 3 | 4 | 5 | 6,
                    })
                    .run()
                }
                className="justify-between"
              >
                <Icon className="size-4" />
                {isActive && <Check className="size-4" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {markActions.map((item) => (
        <ToolbarToggle key={item.label} item={item} />
      ))}

      <Separator orientation="vertical" className="mx-1 h-6" />

      {blockActions.map((item) => (
        <ToolbarToggle key={item.label} item={item} />
      ))}

      <Separator orientation="vertical" className="mx-1 h-6" />

      {historyActions.map((item) => (
        <ToolbarToggle key={item.label} item={item} />
      ))}
    </div>
  );
}
