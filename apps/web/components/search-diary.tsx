"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Calendar, X, FileText, ArrowRight } from "lucide-react";

// Mock diary data for search
const mockDiaries = [
  {
    id: "1",
    title: "A Beautiful Day at the Park",
    excerpt:
      "Today I went to the park and enjoyed the sunshine. The flowers were blooming...",
    date: "2024-01-20",
    score: 85,
    wordCount: 156,
  },
  {
    id: "2",
    title: "My First Day at New Job",
    excerpt:
      "Starting a new job is always exciting and nerve-wracking. I met my new colleagues...",
    date: "2024-01-19",
    score: 78,
    wordCount: 203,
  },
  {
    id: "3",
    title: "Cooking Adventures",
    excerpt:
      "I tried to make pasta from scratch today. It was quite an adventure in the kitchen...",
    date: "2024-01-18",
    score: 82,
    wordCount: 145,
  },
  {
    id: "4",
    title: "Reading a Fascinating Book",
    excerpt:
      "I discovered an amazing novel at the bookstore. The story follows a young explorer...",
    date: "2024-01-17",
    score: 88,
    wordCount: 178,
  },
  {
    id: "5",
    title: "Weekend Trip to the Mountains",
    excerpt:
      "We decided to go hiking in the mountains this weekend. The views were breathtaking...",
    date: "2024-01-15",
    score: 91,
    wordCount: 225,
  },
  {
    id: "6",
    title: "Learning to Play Guitar",
    excerpt:
      "I started learning guitar today. My fingers hurt but it was worth it...",
    date: "2024-01-12",
    score: 75,
    wordCount: 132,
  },
  {
    id: "7",
    title: "A Rainy Day Reflection",
    excerpt:
      "The rain kept falling all day. It gave me time to think about life and future plans...",
    date: "2024-01-09",
    score: 86,
    wordCount: 189,
  },
  {
    id: "8",
    title: "Coffee Shop Conversations",
    excerpt:
      "I had an interesting conversation with a stranger at the coffee shop today...",
    date: "2024-01-08",
    score: 80,
    wordCount: 167,
  },
];

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  score: number;
  wordCount: number;
  matchedText?: string;
}

interface SearchDiaryProps {
  onSelectDiary?: (diaryId: string) => void;
}

export function SearchDiary({ onSelectDiary }: SearchDiaryProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fuzzy search implementation
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    mockDiaries.forEach((diary) => {
      const titleMatch = diary.title.toLowerCase().includes(lowerQuery);
      const excerptMatch = diary.excerpt.toLowerCase().includes(lowerQuery);

      if (titleMatch || excerptMatch) {
        // Find and highlight matched text
        let matchedText = "";
        if (excerptMatch) {
          const index = diary.excerpt.toLowerCase().indexOf(lowerQuery);
          const start = Math.max(0, index - 20);
          const end = Math.min(diary.excerpt.length, index + query.length + 40);
          matchedText =
            (start > 0 ? "..." : "") +
            diary.excerpt.slice(start, end) +
            (end < diary.excerpt.length ? "..." : "");
        }

        results.push({
          ...diary,
          matchedText,
        });
      }
    });

    // Sort by relevance (title match first, then by date)
    return results
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(lowerQuery);
        const bTitle = b.title.toLowerCase().includes(lowerQuery);
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 6);
  }, [query]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % searchResults.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + searchResults.length) % searchResults.length
        );
        break;
      case "Enter":
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          handleSelectDiary(searchResults[selectedIndex].id);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleSelectDiary = (diaryId: string) => {
    onSelectDiary?.(diaryId);
    setQuery("");
    setIsOpen(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="搜索日记..."
          className="w-full h-10 pl-10 pr-10 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.trim() && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {searchResults.length > 0 ? (
            <>
              <div className="px-3 py-2 border-b border-border bg-muted/30">
                <span className="text-xs text-muted-foreground">
                  找到 {searchResults.length} 篇日记
                </span>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <li key={result.id}>
                    <button
                      onClick={() => handleSelectDiary(result.id)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-4 py-3 text-left transition-colors flex items-start gap-3 ${
                        index === selectedIndex
                          ? "bg-primary/10"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground text-sm truncate">
                            {highlightMatch(result.title, query)}
                          </span>
                          <span
                            className={`text-xs font-medium ${getScoreColor(
                              result.score
                            )}`}
                          >
                            {result.score}分
                          </span>
                        </div>
                        {result.matchedText && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {highlightMatch(result.matchedText, query)}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(result.date)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {result.wordCount} 词
                          </span>
                        </div>
                      </div>
                      {index === selectedIndex && (
                        <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="px-3 py-2 border-t border-border bg-muted/30">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    按{" "}
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                      ↑
                    </kbd>{" "}
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                      ↓
                    </kbd>{" "}
                    选择
                  </span>
                  <span>
                    按{" "}
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                      Enter
                    </kbd>{" "}
                    打开
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                未找到匹配 &quot;{query}&quot; 的日记
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                试试其他关键词
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
