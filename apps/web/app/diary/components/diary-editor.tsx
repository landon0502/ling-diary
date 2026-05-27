"use client"

import { useState } from "react"
import { Sparkles, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DiaryEditorProps {
  onAnalyze: (content: string) => void
  isAnalyzing: boolean
}

export function DiaryEditor({ onAnalyze, isAnalyzing }: DiaryEditorProps) {
  const [content, setContent] = useState("")
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const charCount = content.length

  const handleSubmit = () => {
    if (content.trim().length > 0) {
      onAnalyze(content)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            今日日记
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("zh-CN", { 
              year: "numeric", 
              month: "long", 
              day: "numeric",
              weekday: "long"
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex-1 relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your diary in English...&#10;&#10;例如：Today I learned something new about..."
            className="w-full h-full min-h-[300px] lg:min-h-[400px] p-4 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{wordCount} 词</span>
            <span>{charCount} 字符</span>
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={content.trim().length === 0 || isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                AI 分析
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
