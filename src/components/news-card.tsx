"use client";

import { useState, useEffect } from "react";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";
import { CATEGORY_COLORS, CATEGORY_BORDER_COLORS } from "@/lib/constants";

interface NewsCardProps {
  item: NewsItem;
  index: number;
  showFurigana: boolean;
}

export function NewsCard({ item, index, showFurigana }: NewsCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    setIsRead(localStorage.getItem("read:" + item.id) === "1");
  }, [item.id]);

  const handleTitleClick = () => {
    localStorage.setItem("read:" + item.id, "1");
    setIsRead(true);
  };

  const relativeTime = item.publishedAt
    ? formatDistanceToNow(new Date(item.publishedAt), {
        addSuffix: true,
        locale: ja,
      })
    : item.published;

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-lg",
        CATEGORY_BORDER_COLORS[item.category],
        "animate-fade-in-up",
        isRead && "opacity-50"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top accent bar */}
      <div
        className={cn(
          "absolute left-0 right-0 top-0 h-0.5 rounded-t-xl transition-transform duration-300",
          "origin-left scale-x-0 group-hover:scale-x-100",
          item.category === "総合" && "bg-blue-500",
          item.category === "国際" && "bg-purple-500",
          item.category === "経済" && "bg-emerald-500",
          item.category === "科学" && "bg-amber-500",
          item.category === "スポーツ" && "bg-red-500"
        )}
      />

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-md px-2 py-0.5 text-xs font-medium",
            CATEGORY_COLORS[item.category]
          )}
        >
          {item.source}
        </span>
        <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
          {item.category}
        </span>
        {relativeTime && (
          <span className="ml-auto text-xs text-muted-foreground" title={item.published}>
            {relativeTime}
          </span>
        )}
      </div>

      {/* Title */}
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleTitleClick}
        className="text-base font-bold leading-relaxed text-card-foreground transition-colors group-hover:text-accent"
      >
        {showFurigana && item.furiganaTitle ? (
          <span dangerouslySetInnerHTML={{ __html: item.furiganaTitle }} />
        ) : (
          item.title
        )}
      </a>

      {/* Summary */}
      {item.summary && (
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {item.summary}
        </p>
      )}

      {/* Chinese Translation */}
      {item.titleZh && (
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent/80"
        >
          {showTranslation ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
          中文翻译
        </button>
      )}
      {showTranslation && item.titleZh && (
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          🇨🇳 {item.titleZh}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto border-t border-border pt-3">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleTitleClick}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-all hover:gap-2.5"
        >
          記事を読む
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
