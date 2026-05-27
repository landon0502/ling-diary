"use client"

import { TrendingUp, BookOpen, Target, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface QuickStat {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  subtext?: string
  trend?: "up" | "down" | "neutral"
  color: string
}

const quickStats: QuickStat[] = [
  {
    icon: TrendingUp,
    label: "本周评分",
    value: "82.5",
    subtext: "+5.2 vs 上周",
    trend: "up",
    color: "text-success",
  },
  {
    icon: BookOpen,
    label: "本周日记",
    value: "5",
    subtext: "目标 7 篇",
    trend: "neutral",
    color: "text-primary",
  },
  {
    icon: Target,
    label: "今日目标",
    value: "150",
    subtext: "词",
    trend: "neutral",
    color: "text-warning",
  },
  {
    icon: Award,
    label: "本月排名",
    value: "#12",
    subtext: "前 5%",
    trend: "up",
    color: "text-accent",
  },
]

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {quickStats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  {stat.subtext && (
                    <p className={cn(
                      "text-xs mt-0.5",
                      stat.trend === "up" ? "text-success" : 
                      stat.trend === "down" ? "text-destructive" : 
                      "text-muted-foreground"
                    )}>
                      {stat.subtext}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
