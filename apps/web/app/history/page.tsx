"use client";

import { useState } from "react";
import { DiaryHistory } from "./components/diary-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null);

  const handleClearSelection = () => {
    setSelectedDiaryId(null);
  };

  const handleTabChange = (tab: string) => {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2">
        <DiaryHistory
          selectedDiaryId={selectedDiaryId}
          onClearSelection={handleClearSelection}
        />
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">日历视图</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-muted-foreground font-medium"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 4 + 1;
                const hasEntry = [
                  1, 2, 5, 8, 9, 12, 15, 16, 17, 18, 19, 20,
                ].includes(day);
                const isToday = day === 20;
                return (
                  <div
                    key={i}
                    className={`p-2 rounded-md text-sm ${
                      day < 1 || day > 31
                        ? "text-transparent"
                        : isToday
                        ? "bg-primary text-primary-foreground font-bold"
                        : hasEntry
                        ? "bg-success/20 text-success"
                        : "text-muted-foreground hover:bg-muted cursor-pointer"
                    }`}
                  >
                    {day > 0 && day <= 31 ? day : ""}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">15</div>
              <div className="text-sm text-muted-foreground">本月已写日记</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
