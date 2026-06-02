"use client";

import { toast } from "sonner";
import { DiaryEditor } from "./components";
import useServices from "./useServices";

export default function DiaryPage() {
  const { createDiaryControl } = useServices();
  const { loading, runAsync: submitDiaryContent } = createDiaryControl;
  const handleAnalyze = async (content: string) => {
    if (!content) return toast.info("请编写日记内容");
    await submitDiaryContent({ content, isAnalyze: 0, title: "test title" });
    toast.success("提交成功", { position: "top-center" });
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 gap-6 h-full">
        <DiaryEditor onAnalyze={handleAnalyze} isAnalyzing={loading} />
      </div>
    </div>
  );
}
