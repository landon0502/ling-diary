"use client";

import { useCallback } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import { PaginationPlus, PAGE_SIZES } from "tiptap-pagination-plus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useLocalStorageState } from "ahooks";

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import {
  Heading1,
  Heading2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DiaryEditorProps {
  onAnalyze: (content: string) => void;
  isAnalyzing: boolean;
}

interface ToolbarAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
  isActive: boolean;
  disabled?: boolean;
}

export function AnimatedGradientTextBtn() {
  return (
    <div className="group relative flex items-center justify-end rounded-lg px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
      <span
        className={cn(
          "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
        )}
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
          WebkitClipPath: "padding-box",
        }}
      />
      🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
      <AnimatedGradientText className="text-sm font-medium">
        提交
      </AnimatedGradientText>
      <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
    </div>
  );
}

export function DiaryEditor({ onAnalyze, isAnalyzing }: DiaryEditorProps) {
  const [diaryCache, setDiaryCache] =
    useLocalStorageState<JSONContent>("diary");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your diary here...",
      }),
      CharacterCount.configure(),
      PaginationPlus.configure({
        pageHeight: 800, // Height of each page in pixels
        pageWidth: 789, // Width of each page in pixels
        pageGap: 50, // Gap between pages in pixels
        pageGapBorderSize: 1, // Border size for page gaps
        pageGapBorderColor: "#e5e5e5", // Border color for page gaps
        pageBreakBackground: "#ffffff", // Background color for page gaps
        footerRight: "Made with ❤️ by Romik", // Custom HTML content to display in the footer right side
        footerLeft:
          "<p><strong>Contact Me :</strong><br>dev.romikmakavana@gmail.com</p>", // Custom HTML content to display in the footer left side
        headerRight: "Page {page}", // Custom HTML content to display in the header right side
        headerLeft: "<h1>Tiptap Pagination Plus</h1><p>by Romik Makavana</p>", // Custom HTML content to display in the header left side
        marginTop: 20, // Top margin for pages
        marginBottom: 20, // Bottom margin for pages
        marginLeft: 50, // Left margin for pages
        marginRight: 50, // Right margin for pages
        contentMarginTop: 10, // Top margin for content within pages
        contentMarginBottom: 10, // Bottom margin for content within pages
        // Optional: Per-page header/footer customization
        customHeader: {
          2: { headerLeft: "Page 2 Header", headerRight: "Page {page}" },
        },
        customFooter: {
          3: { footerLeft: "Page 3 Footer", footerRight: "Page {page}" },
        },
        // Optional: Click callbacks
        onHeaderClick: ({ event, pageNumber }) => {
          console.log(`Header clicked on page ${pageNumber}`);
        },
        onFooterClick: ({ event, pageNumber }) => {
          console.log(`Footer clicked on page ${pageNumber}`);
        },
      }),
    ],
    content: diaryCache,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    onUpdate({ editor }) {
      setDiaryCache(editor.getJSON());
    },
  });

  // TipTap 官方 React 模式：通过 selector 订阅响应式状态
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (ctx && ctx.editor) {
        return {
          isH1: ctx.editor.isActive("heading", { level: 1 }),
          isH2: ctx.editor.isActive("heading", { level: 2 }),
          isBold: ctx.editor.isActive("bold"),
          isItalic: ctx.editor.isActive("italic"),
          isBulletList: ctx.editor.isActive("bulletList"),
          isOrderedList: ctx.editor.isActive("orderedList"),
          isBlockquote: ctx.editor.isActive("blockquote"),
          canUndo: ctx.editor.can().undo(),
          canRedo: ctx.editor.can().redo(),
        };
      }
    },
  });

  const handleSubmit = useCallback(() => {
    const text = editor?.getText();
    if (text && text.trim().length > 0) {
      onAnalyze(text);
    }
  }, [editor, onAnalyze]);

  if (!editor) return null;

  const headingActions: ToolbarAction[] = [
    {
      icon: Heading1,
      label: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editorState?.isH1 ?? false,
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editorState?.isH2 ?? false,
    },
  ];

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
  ];

  return (
    <div className="h-full flex flex-col">
      <TooltipProvider>
        <div className="mb-4 flex items-center justify-between gap-1 rounded-lg border bg-muted/40 p-1 box-border">
          <div className="flex items-center gap-1">
            {headingActions.map((item) => (
              <ToolbarToggle key={item.label} item={item} />
            ))}

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
          <AnimatedGradientTextBtn />
        </div>
      </TooltipProvider>
      <div className="flex-1 relative">
        <div className="absolute top-0 left-0 bottom-0 right-0">
          <div className="w-full h-full flex flex-col items-center overflow-y-scroll">
            <EditorContent editor={editor} className=" h-full" />
          </div>
        </div>
      </div>
      <style jsx>
        {`
          :global(.ProseMirror) {
            outline: none;
            border: none;
          }
        `}
      </style>
    </div>
  );
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
