"use client";

import { useState, useMemo } from "react";
import type { NewsItem } from "@/lib/types";
import { CategoryFilter } from "./category-filter";
import { TrendingKeywords } from "./trending-keywords";
import { NewsCard } from "./news-card";

interface NewsGridProps {
  items: NewsItem[];
  keywords: string[];
}

export function NewsGrid({ items, keywords }: NewsGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [showFurigana, setShowFurigana] = useState(false);

  const filtered = useMemo(() => {
    let result = items;

    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (activeKeyword) {
      result = result.filter(
        (item) =>
          item.title.includes(activeKeyword) ||
          item.summary.includes(activeKeyword)
      );
    }

    return result;
  }, [items, activeCategory, activeKeyword]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length };
    for (const item of items) {
      map[item.category] = (map[item.category] || 0) + 1;
    }
    return map;
  }, [items]);

  const hasFurigana = items.some((item) => item.furiganaTitle);

  return (
    <>
      <CategoryFilter
        active={activeCategory}
        onSelect={(cat) => {
          setActiveCategory(cat);
          setActiveKeyword(null);
        }}
        counts={counts}
        showFurigana={showFurigana}
        onToggleFurigana={hasFurigana ? () => setShowFurigana(!showFurigana) : undefined}
      />

      <TrendingKeywords
        keywords={keywords}
        activeKeyword={activeKeyword}
        onSelect={(kw) => {
          setActiveKeyword(kw);
          if (kw) setActiveCategory("all");
        }}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-20 text-muted-foreground">
          <span className="mb-3 text-4xl">📭</span>
          <p>該当するニュースがありません</p>
        </div>
      ) : (
        <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-4 py-6 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <NewsCard
              key={item.id}
              item={item}
              index={i}
              showFurigana={showFurigana}
            />
          ))}
        </main>
      )}
    </>
  );
}
