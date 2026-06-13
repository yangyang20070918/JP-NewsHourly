import { createClient } from "@supabase/supabase-js";
import type { NewsItem } from "./types";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_ANON_KEY ?? "";

export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function saveNewsItems(items: NewsItem[]): Promise<void> {
  if (!supabase) return;

  const rows = items.map((item) => ({
    id: item.id,
    title: item.title,
    title_zh: item.titleZh ?? null,
    furigana_title: item.furiganaTitle ?? null,
    link: item.link,
    summary: item.summary,
    source: item.source,
    category: item.category,
    published: item.published,
    published_at: item.publishedAt ?? null,
  }));

  const { error } = await supabase
    .from("news_items")
    .upsert(rows, { onConflict: "id" });

  if (error) console.warn("[WARN] Supabase upsert failed:", error.message);
}

export async function saveKeywords(
  date: string,
  keywords: string[]
): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from("daily_keywords")
    .upsert({ date, keywords }, { onConflict: "date" });

  if (error) console.warn("[WARN] Supabase keywords save failed:", error.message);
}

export async function getNewsByDate(date: string): Promise<NewsItem[]> {
  if (!supabase) return [];

  const startOfDay = `${date}T00:00:00+09:00`;
  const endOfDay = `${date}T23:59:59+09:00`;

  const { data, error } = await supabase
    .from("news_items")
    .select("*")
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)
    .order("published_at", { ascending: false });

  if (error) {
    console.warn("[WARN] Supabase query failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    titleZh: row.title_zh,
    furiganaTitle: row.furigana_title,
    link: row.link,
    summary: row.summary ?? "",
    source: row.source,
    category: row.category,
    published: row.published ?? "",
    publishedAt: row.published_at,
  }));
}

export async function getKeywordsByDate(date: string): Promise<string[]> {
  if (!supabase) return [];

  const { data } = await supabase
    .from("daily_keywords")
    .select("keywords")
    .eq("date", date)
    .single();

  return (data?.keywords as string[]) ?? [];
}

export async function getAvailableDates(): Promise<string[]> {
  if (!supabase) return [];

  const { data } = await supabase
    .from("news_items")
    .select("created_at")
    .order("created_at", { ascending: false });

  if (!data) return [];

  const dates = new Set(
    data.map((row) => {
      const d = new Date(row.created_at);
      return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
    })
  );

  return [...dates].slice(0, 30);
}
