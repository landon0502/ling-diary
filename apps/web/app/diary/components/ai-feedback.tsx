"use client"

import { CheckCircle2, AlertCircle, Lightbulb, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GrammarError {
  original: string
  corrected: string
  explanation: string
  type: "grammar" | "spelling" | "punctuation" | "style"
}

interface AIFeedbackProps {
  score: number | null
  errors: GrammarError[]
  suggestions: string[]
  rewrittenVersion: string
  isVisible: boolean
}

const typeLabels = {
  grammar: { label: "语法", color: "text-destructive" },
  spelling: { label: "拼写", color: "text-warning" },
  punctuation: { label: "标点", color: "text-chart-2" },
  style: { label: "风格", color: "text-primary" },
}

export function AIFeedback({ score, errors, suggestions, rewrittenVersion, isVisible }: AIFeedbackProps) {
  if (!isVisible) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">AI 反馈区</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            写完日记后点击「AI 分析」，获取评分、语法纠错和改写建议
          </p>
        </div>
      </Card>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-warning"
    return "text-destructive"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "优秀"
    if (score >= 80) return "良好"
    if (score >= 70) return "中等"
    if (score >= 60) return "及格"
    return "需改进"
  }

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">AI 分析结果</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-6">
        {/* Score */}
        {score !== null && (
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className={cn("text-4xl font-bold", getScoreColor(score))}>
              {score}
            </div>
            <div>
              <div className={cn("font-medium", getScoreColor(score))}>
                {getScoreLabel(score)}
              </div>
              <div className="text-sm text-muted-foreground">综合评分</div>
            </div>
          </div>
        )}

        {/* Grammar Errors */}
        {errors.length > 0 && (
          <div>
            <h4 className="flex items-center gap-2 font-medium text-foreground mb-3">
              <AlertCircle className="w-4 h-4 text-destructive" />
              语法纠错 ({errors.length})
            </h4>
            <div className="space-y-3">
              {errors.map((error, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full bg-muted", typeLabels[error.type].color)}>
                      {typeLabels[error.type].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="line-through text-destructive">{error.original}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-success font-medium">{error.corrected}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{error.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <h4 className="flex items-center gap-2 font-medium text-foreground mb-3">
              <Lightbulb className="w-4 h-4 text-warning" />
              改进建议
            </h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rewritten Version */}
        {rewrittenVersion && (
          <div>
            <h4 className="flex items-center gap-2 font-medium text-foreground mb-3">
              <CheckCircle2 className="w-4 h-4 text-success" />
              AI 改写建议
            </h4>
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {rewrittenVersion}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
