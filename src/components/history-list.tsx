"use client";

import { useState, useEffect } from "react";
import type { NewsItem } from "@/lib/types";
import { NewsCard } from "./news-card";

export function HistoryList() {
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
  });
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/history?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [date]);

  return (
    <div>
      <div className="mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
          <p>読み込み中...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <span className="mb-3 block text-4xl">📭</span>
          <p>この日のニュースはありません</p>
          <p className="mt-1 text-xs">
            Supabase が未設定の場合、履歴は利用できません
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} showFurigana={false} />
          ))}
        </div>
      )}
    </div>
  );
}
