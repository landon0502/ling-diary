"use client";

import { toast } from "sonner";
import { DiaryEditor, type DiaryData } from "./components";
import useServices from "./useServices";
export default function DiaryPage() {
  const { createDiaryControl } = useServices();
  const { loading, runAsync: submitDiaryContent } = createDiaryControl;
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

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 gap-6 h-full">
        <DiaryEditor onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
