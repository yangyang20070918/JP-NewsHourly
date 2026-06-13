"use client";

import { cn } from "@/lib/utils";
import { ALL_CATEGORIES } from "@/lib/constants";
import { Languages } from "lucide-react";

interface CategoryFilterProps {
  active: string;
  onSelect: (category: string) => void;
  counts: Record<string, number>;
  showFurigana: boolean;
  onToggleFurigana?: () => void;
}

export function CategoryFilter({
  active,
  onSelect,
  counts,
  showFurigana,
  onToggleFurigana,
}: CategoryFilterProps) {
  const categories: { label: string; value: string }[] = [
    { label: "すべて", value: "all" },
    ...ALL_CATEGORIES.map((c) => ({ label: c, value: c })),
  ];

  return (
    <nav className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 pt-4 sm:px-6">
      {categories.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={cn(
            "whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
            active === value
              ? "border-accent bg-accent text-accent-foreground shadow-sm"
              : "border-border bg-card text-muted-foreground hover:border-accent hover:text-accent"
          )}
        >
          {label}
          {counts[value] !== undefined && (
            <span className="ml-1.5 text-xs opacity-60">{counts[value]}</span>
          )}
        </button>
      ))}

      {onToggleFurigana && (
        <button
          onClick={onToggleFurigana}
          className={cn(
            "ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
            showFurigana
              ? "border-pink-400 bg-pink-500 text-white"
              : "border-border bg-card text-muted-foreground hover:border-pink-400 hover:text-pink-500"
          )}
          title="ふりがな表示"
        >
          <Languages className="h-3.5 w-3.5" />
          ふりがな
        </button>
      )}
    </nav>
  );
}
