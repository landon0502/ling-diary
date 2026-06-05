"use client";

import { toast } from "sonner";
import { AiEditor, type DiaryData } from "@/components/ai-editor";
import useServices from "./useServices";
import { AiChat } from "@/components/chat";
import { useLocalStorageState } from "ahooks";
import { createContext } from "react";
import { SetState } from "ahooks/lib/createUseStorageState";

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
      toast.info("请编写日记标题");
      return;
    }
    if (!data.content) {
      toast.info("请编写日记内容");
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
        <div className="flex flex-row h-full relative">
          <div className="flex-1">
            <AiEditor
              data={diaryData}
              loading={loading}
              onSubmit={handleSubmit}
              onAfterSubmit={onAfterSubmit}
              onUpdate={onChange}
            />
          </div>
          <div className="w-110 h-full border-l">
            <AiChat systemContent={diaryData.content} />
          </div>
        </div>
      </div>
    </DiaryContext>
  );
}
