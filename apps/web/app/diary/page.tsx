"use client";

import { toast } from "sonner";
import { AiEditor, type DiaryData } from "@/components/ai-editor";
import useServices from "./useServices";
import { AiChat } from "@/components/chat";
import { useLocalStorageState } from "ahooks";
import { createContext } from "react";
import { SetState } from "ahooks/lib/createUseStorageState";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Brain, ChevronsRight } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
export const DiaryContext = createContext<{
  diaryData?: DiaryData;
  setDiaryData?: (this: unknown, value: SetState<DiaryData>) => void;
}>({});

export default function DiaryPage() {
  const { createDiaryControl } = useServices();
  const { loading, runAsync: submitDiaryContent } = createDiaryControl;
  const [diaryData, setDiaryData] = useLocalStorageState<DiaryData>("diary", {
    defaultValue: {
      title: "",
      content: "",
    },
  });

  const handleSubmit = async (data: DiaryData) => {
    if (!data.title) {
      toast.info("请编写日记标题", { position: "top-center" });
      return;
    }
    if (!data.content) {
      toast.info("请编写日记内容", { position: "top-center" });
      return;
    }
    await submitDiaryContent({
      title: data.title ?? "",
      content: data.content ?? "",
      contentJSON: JSON.stringify(data.contentJSON),
      isAnalyze: 0,
    });
    toast.success("提交成功", { position: "top-center" });
  };

  const onAfterSubmit = () => {
    setDiaryData({
      title: "",
      content: void 0,
      contentJSON: void 0,
    });
  };

  const onChange = ({ title, content, contentJSON }: DiaryData) => {
    setDiaryData({
      title,
      content,
      contentJSON,
    });
  };
  return (
    <DiaryContext
      value={{
        diaryData,
        setDiaryData,
      }}
    >
      <div className="h-full">
        <Collapsible asChild>
          <div className="flex flex-row h-full relative">
            <div className="flex-1">
              <AiEditor
                data={diaryData}
                loading={loading}
                onSubmit={handleSubmit}
                onAfterSubmit={onAfterSubmit}
                onUpdate={onChange}
                menubarRight={
                  <CollapsibleTrigger asChild>
                    <ShimmerButton className="group px-3">
                      <Brain className="group-data-[state=open]:hidden" />
                      <ChevronsRight className="hidden group-data-[state=open]:block" />
                    </ShimmerButton>
                  </CollapsibleTrigger>
                }
              />
            </div>
            <CollapsibleContent asChild>
              <div className="w-110 h-full border-l">
                <AiChat
                  systemContent={diaryData.content}
                  systemTitle={diaryData.title}
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </DiaryContext>
  );
}
