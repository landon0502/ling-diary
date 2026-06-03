"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Calendar, ChevronRight, Star, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useServices from "../useServices";
import { useMounted } from "@/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pagination } from "@/components/pagination";

// ==================== 常量 ====================

const PAGE_SIZE = 10;

// ==================== 样式工具 ====================

const getScoreColor = (score: number) => {
  if (score >= 85) return "text-success bg-success/10 border-success/20";
  if (score >= 70) return "text-warning bg-warning/10 border-warning/20";
  return "text-destructive bg-destructive/10 border-destructive/20";
};

// ==================== 组件 ====================

interface DiaryHistoryProps {
  selectedDiaryId?: string | null;
  onClearSelection?: () => void;
}

export function DiaryHistory({
  selectedDiaryId,
  onClearSelection,
}: DiaryHistoryProps) {
  // ---- 本地状态 ----
  const [filterQuery, setFilterQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ---- Refs ----
  const loadingRef = useRef(false);
  const isFirstMount = useRef(true);

  // ---- Hooks ----
  const mounted = useMounted();
  const { diariesControl, diaries, total } = useServices();
  const { runAsync: getList, loading } = diariesControl;

  // 总页数
  const totalPages = useMemo(
    () => Math.ceil((total ?? 0) / PAGE_SIZE),
    [total]
  );

  // 是否为首次加载 / 筛选加载中（列表为空且正在请求）
  const isInitialLoading = diaries.length === 0 && loading;

  // ---- 核心方法：加载数据 ----
  const loadDiaries = useCallback(
    async (page: number, keyword: string) => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      try {
        await getList({
          page,
          page_size: PAGE_SIZE,
          keyword: keyword || undefined,
        });
      } finally {
        loadingRef.current = false;
      }
    },
    [getList]
  );

  // ---- 副作用：首次加载 ----
  useEffect(() => {
    if (!mounted) return;

    loadDiaries(1, "").finally(() => {
      isFirstMount.current = false;
    });
    // 仅在挂载时执行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // ---- 副作用：关键字筛选变更 ----
  useEffect(() => {
    if (isFirstMount.current || !mounted) return;

    const timer = setTimeout(() => {
      setCurrentPage(1);
      loadDiaries(1, filterQuery);
    }, 300); // 300ms 防抖

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterQuery]);

  // ---- 副作用：页码变更 ----
  useEffect(() => {
    if (isFirstMount.current || !mounted) return;

    loadDiaries(currentPage, filterQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // ---- 分页回调 ----
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // ---- 渲染 ----
  return (
    <Card className="h-full flex flex-col">
      {/* ========== 头部 ========== */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            日记历史
          </CardTitle>
          <span className="text-sm text-muted-foreground">共 {total} 篇</span>
        </div>
        {/* 本地关键字筛选 */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="筛选日记..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </CardHeader>

      {/* ========== 列表区域 ========== */}
      <CardContent className="flex-1 overflow-y-auto relative overflow-hidden p-0">
        <div className="absolute top-0 bottom-0 w-full">
          <ScrollArea className="h-full w-full px-4">
            {/* 首次加载 / 筛选加载中 */}
            {isInitialLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  加载中...
                </span>
              </div>
            ) : diaries.length > 0 ? (
              <div className="space-y-3">
                {/* 日记卡片列表 */}
                {diaries.map((diary) => (
                  <div
                    id={`diary-${diary.id}`}
                    key={diary.id}
                    className={cn(
                      "group p-4 box-border rounded-lg border transition-all cursor-pointer",
                      "bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* 标题 */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground truncate">
                            {diary.title}
                          </span>
                        </div>

                        {/* 日期 + 评分 */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground">
                            {diary.created_at}
                          </span>
                          <span
                            className={cn(
                              "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border",
                              getScoreColor(diary.score ?? 0)
                            )}
                          >
                            <Star className="w-3 h-3" />
                            {diary.score}
                          </span>
                        </div>

                        {/* 内容预览 */}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {diary.content}
                        </p>

                        {/* 字数 */}
                        <p className="text-xs text-muted-foreground mt-2">
                          {diary.content.length} 词
                        </p>
                      </div>

                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </div>
                ))}

                {/* 加载更多指示 */}
                {loading && !isInitialLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            ) : (
              /* 空状态 */
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {filterQuery ? "未找到匹配的日记" : "暂无日记，快去写一篇吧"}
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>

      {/* ========== 分页 ========== */}
      {totalPages > 0 && (
        <div className="py-3 border-t border-border">
          <Pagination
            current={currentPage}
            total={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
    </Card>
  );
}
