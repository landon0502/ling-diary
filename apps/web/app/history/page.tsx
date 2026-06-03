"use client";

import { useState } from "react";
import { DiaryHistory } from "./components/diary-history";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
export default function HistoryPage() {
  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null);

  const handleClearSelection = () => {
    setSelectedDiaryId(null);
  };

  const handleTabChange = (tab: string) => {};

  return (
    <div className="flex flex-row gap-6 h-full">
      <div className="flex-1">
        <DiaryHistory
          selectedDiaryId={selectedDiaryId}
          onClearSelection={handleClearSelection}
        />
      </div>
      <div className="space-y-6 lg:w-80">
        <Calendar mode="single" className="rounded-lg border w-full" />
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
