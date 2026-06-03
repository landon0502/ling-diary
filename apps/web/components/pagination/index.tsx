"use client";

import { useMemo, useCallback } from "react";
import {
  Pagination as Pagin,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

// ==================== 类型定义 ====================

export interface PaginationProps {
  /** 当前页码（从 1 开始） */
  current: number;
  /** 总页数 */
  total: number;
  /** 页码变化回调 */
  onChange: (page: number) => void;
  /** 当前页两侧显示的兄弟页码数，默认 1 */
  siblingCount?: number;
  /** 自定义 class */
  className?: string;
}

type PageItem = number | "ellipsis";

// ==================== 页码生成算法 ====================

/**
 * 生成带省略号的页码数组。
 *
 * 规则：
 * - 总页数 ≤ 2*siblingCount + 5 时，全部展示（无省略号）
 * - 否则始终展示首页、末页，当前页两侧各 siblingCount 个页码
 * - 中间缺失部分用省略号填充
 */
function generatePageItems(
  current: number,
  total: number,
  siblingCount: number
): PageItem[] {
  // 全部可容纳的页码数：首页 + 末页 + 当前页 + 2个省略号 + 2*siblingCount
  const maxVisible = siblingCount * 2 + 5;

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // 当前页左右兄弟页码的范围
  const leftSibling = Math.max(current - siblingCount, 2);
  const rightSibling = Math.min(current + siblingCount, total - 1);

  const pages: PageItem[] = [];

  // 首页
  pages.push(1);

  // 左侧省略号（首页和左兄弟之间有间隙）
  if (leftSibling > 2) {
    pages.push("ellipsis");
  }

  // 中间的连续页码
  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }

  // 右侧省略号（右兄弟和末页之间有间隙）
  if (rightSibling < total - 1) {
    pages.push("ellipsis");
  }

  // 末页
  pages.push(total);

  return pages;
}

// ==================== 组件 ====================

export function Pagination({
  current,
  total,
  onChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const isPrevDisabled = current <= 1;
  const isNextDisabled = current >= total;

  // 页码列表（仅在 current / total 变化时重新计算）
  const pageItems = useMemo(
    () => generatePageItems(current, total, siblingCount),
    [current, total, siblingCount]
  );

  // 上一页
  const handlePrev = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (!isPrevDisabled) onChange(current - 1);
    },
    [current, isPrevDisabled, onChange]
  );

  // 下一页
  const handleNext = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (!isNextDisabled) onChange(current + 1);
    },
    [current, isNextDisabled, onChange]
  );

  // 点击指定页码
  const handlePageClick = useCallback(
    (page: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onChange(page);
    },
    [onChange]
  );

  // 总页数为 0（无数据）时不渲染
  if (total <= 0) return null;

  return (
    <Pagin className={className}>
      <PaginationContent>
        {/* 上一页 */}
        <PaginationItem
          className={cn(isPrevDisabled && "pointer-events-none opacity-50")}
        >
          <PaginationPrevious href="#" onClick={handlePrev} text="上一页" />
        </PaginationItem>

        {/* 页码 + 省略号 */}
        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`e-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === current}
                onClick={handlePageClick(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* 下一页 */}
        <PaginationItem
          className={cn(isNextDisabled && "pointer-events-none opacity-50")}
        >
          <PaginationNext href="#" onClick={handleNext} text="下一页" />
        </PaginationItem>
      </PaginationContent>
    </Pagin>
  );
}
