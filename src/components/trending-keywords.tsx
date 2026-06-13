"use client";

import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface TrendingKeywordsProps {
  keywords: string[];
  activeKeyword: string | null;
  onSelect: (keyword: string | null) => void;
}

export function TrendingKeywords({
  keywords,
  activeKeyword,
  onSelect,
}: TrendingKeywordsProps) {
  if (keywords.length === 0) return null;

  return (
    <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 pt-3 sm:px-6">
      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground">
        <TrendingUp className="h-3.5 w-3.5" />
        HOT
      </span>
      {keywords.map((kw) => (
        <button
          key={kw}
          onClick={() => onSelect(activeKeyword === kw ? null : kw)}
          className={cn(
            "whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-all",
            activeKeyword === kw
              ? "bg-orange-500 text-white shadow-sm"
              : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50"
          )}
        >
          {kw}
        </button>
      ))}
    </div>
  );
}
