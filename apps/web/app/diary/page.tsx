"use client";

import { useState } from "react";
import { DiaryEditor, QuickStats, AIFeedback } from "./components";

// Mock AI analysis result
const mockAnalysis = {
  score: 82,
  errors: [
    {
      original: "I goes to",
      corrected: "I went to",
      explanation:
        "动词时态错误：主语是第一人称 I，过去式应该用 went 而不是 goes",
      type: "grammar" as const,
    },
    {
      original: "beautifull",
      corrected: "beautiful",
      explanation: "拼写错误：beautiful 只有一个 l",
      type: "spelling" as const,
    },
    {
      original: "very very good",
      corrected: "extremely good",
      explanation:
        "表达建议：避免重复使用 very，可以用 extremely, incredibly 等词替代",
      type: "style" as const,
    },
  ],
  suggestions: [
    "尝试使用更多的连接词（however, moreover, therefore）来增强文章的逻辑性",
    "可以增加一些具体的细节描写，让日记更加生动",
    "建议在结尾加入个人感受或反思，提升文章深度",
  ],
  rewrittenVersion: `Today I went to the bookstore and discovered a fascinating novel about adventure. The story follows a young explorer who embarks on an incredible journey through uncharted territories. I was particularly drawn to the vivid descriptions of the landscapes and the protagonist's inner struggles. It reminded me of my own aspirations to explore the world someday. I spent nearly two hours reading the first few chapters and couldn't put it down. This experience reinforced my belief that reading is one of the most rewarding ways to expand our horizons.`,
};

export default function DiaryPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowFeedback(true);
    }, 2000);
  };

  return (
    <div className="h-full">
      <QuickStats />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6 h-[calc(100%-120px)]">
        <DiaryEditor onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        <AIFeedback
          score={mockAnalysis.score}
          errors={mockAnalysis.errors}
          suggestions={mockAnalysis.suggestions}
          rewrittenVersion={mockAnalysis.rewrittenVersion}
          isVisible={showFeedback}
        />
      </div>
    </div>
  );
}
