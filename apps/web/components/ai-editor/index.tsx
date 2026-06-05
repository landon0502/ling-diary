"use client";

import { useCallback, forwardRef, useImperativeHandle } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import type { JSONContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { CircleCheck } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import MenusBar from "./MenusBar";
import { AiMessage } from "./extensions/AiMessage";
import { toast } from "sonner";

import "./index.scss";

export interface DiaryData {
  content?: string;
  contentJSON?: JSONContent;
  title: string;
}

interface DiaryEditorProps {
  loading?: boolean;
  data?: DiaryData;
  onSubmit: (data: DiaryData) => Promise<void> | void;
  onAfterSubmit?: () => Promise<void> | void;
  onUpdate?: (props: DiaryData) => void;
}

const AiEditor = forwardRef<{ editor: Editor | unknown }, DiaryEditorProps>(
  ({ onSubmit, loading, onAfterSubmit, data: diaryCache, onUpdate }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        AiMessage,
        Placeholder.configure({
          placeholder: "Write your diary here...",
        }),
        CharacterCount.configure(),
      ],
      content: diaryCache?.contentJSON,
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      onUpdate({ editor }) {
        onUpdate?.({
          title: diaryCache?.title ?? "",
          content: editor.getText(),
          contentJSON: editor.getJSON(),
        });
      },
    });

    const handleSubmit = useCallback(async () => {
      if (editor?.isEmpty) {
        toast.warning("请输入内容", { position: "top-center" });
        return;
      }
      await onSubmit({
        content: editor?.getText(),
        contentJSON: editor?.getJSON(),
        title: diaryCache?.title ?? "",
      });
      editor?.commands.setContent("");

      onAfterSubmit?.();
    }, [editor, onSubmit, diaryCache, onAfterSubmit]);

    useImperativeHandle(ref, () => ({
      editor,
    }));

    if (!editor) return null;

    return (
      <div className="h-full flex flex-col flex-1">
        <TooltipProvider>
          <div className="flex items-center justify-between gap-1 bg-muted/40 p-1 box-border">
            <MenusBar editor={editor} />
            <div className="flex gap-2">
              <ShimmerButton onClick={handleSubmit} className="shadow-2xl">
                <span className="relative z-10 flex items-center justify-center gap-2 text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap text-white  dark:from-white dark:to-slate-900/10">
                  {loading ? (
                    <>
                      提交中
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      提交
                      <CircleCheck className="w-4 h-4 group-hover:scale-125 transition-transform" />
                    </>
                  )}
                </span>
              </ShimmerButton>
            </div>
          </div>
        </TooltipProvider>
        <div className="flex-1 relative">
          <div>
            <Input
              className="flex h-12 w-full rounded-none border-none bg-transparent px-3 py-1 shadow-xs focus:border-none"
              placeholder="请输入标题"
              defaultValue={diaryCache?.title}
              onChange={(e) => {
                onUpdate?.({
                  title: e.target.value,
                  content: editor.getText(),
                  contentJSON: editor.getJSON(),
                });
              }}
            />
          </div>
          <div className="absolute top-12 left-0 bottom-0 right-0 py-2 px-4 overflow-y-scroll scrollbar-hide">
            <EditorContent editor={editor} className="w-full" />
          </div>
        </div>
        <style jsx>
          {`
            :global(.ProseMirror) {
              outline: none;
              border: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none; /* IE 和 Edge */
              scrollbar-width: none; /* Firefox */
            }

            .scrollbar-hide::-webkit-scrollbar {
              display: none; /* Chrome、Safari */
            }
            :global(.tiptap p.is-editor-empty:first-child::before) {
              content: attr(data-placeholder);
              color: #adb5bd;
              pointer-events: none;
              float: left;
              height: 0;
            }
          `}
        </style>
      </div>
    );
  }
);

AiEditor.displayName = "AiEditor";
export { AiEditor };
