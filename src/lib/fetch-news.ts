import Parser from "rss-parser";
import crypto from "crypto";
import type { NewsItem, NewsData, FeedConfig } from "./types";
import { FEEDS, MAX_ITEMS } from "./constants";
import { enrichWithAI } from "./ai-enrich";
import { saveNewsItems, saveKeywords } from "./supabase";

const parser = new Parser({
  timeout: 15_000,
  headers: { "User-Agent": "JP-NewsHourly/2.0" },
});

function makeId(link: string): string {
  return crypto.createHash("md5").update(link).digest("hex").slice(0, 12);
}

function getBigrams(text: string): Set<string> {
  const normalized = text.replace(/\s+/g, "");
  const bigrams = new Set<string>();
  for (let i = 0; i < normalized.length - 1; i++) {
    bigrams.add(normalized.slice(i, i + 2));
  }
  return bigrams;
}

function bigramJaccard(a: string, b: string): number {
  const setA = getBigrams(a);
  const setB = getBigrams(b);
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const bg of setA) {
    if (setB.has(bg)) intersection++;
  }

  return intersection / (setA.size + setB.size - intersection);
}

function deduplicateByTitle(items: NewsItem[]): NewsItem[] {
  const kept: NewsItem[] = [];

  for (const item of items) {
    const isDuplicate = kept.some(
      (existing) => bigramJaccard(existing.title, item.title) > 0.4
    );

    if (!isDuplicate) {
      kept.push(item);
    } else {
      const idx = kept.findIndex(
        (existing) => bigramJaccard(existing.title, item.title) > 0.4
      );
      if (idx >= 0 && item.summary.length > kept[idx].summary.length) {
        kept[idx] = item;
      }
    }
  }

  return kept;
}

async function parseFeed(feed: FeedConfig): Promise<NewsItem[]> {
  try {
    const d = await parser.parseURL(feed.url);
    return (d.items ?? [])
      .filter((entry) => entry.link && entry.title?.trim())
      .map((entry) => {
        let summary = (entry.contentSnippet || entry.content || "").trim();
        if (summary.length > 200) summary = summary.slice(0, 197) + "...";

        const pubDate = entry.isoDate
          ? new Date(entry.isoDate)
          : entry.pubDate
            ? new Date(entry.pubDate)
            : null;

        const published = pubDate
          ? pubDate.toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        const publishedAt = pubDate ? pubDate.toISOString() : undefined;

        return {
          id: makeId(entry.link!),
          title: entry.title!.trim(),
          link: entry.link!,
          summary,
          source: feed.source,
          category: feed.category,
          published,
          publishedAt,
        };
      });
  } catch (err) {
    console.warn(`[WARN] Failed to fetch ${feed.name}:`, err);
    return [];
  }
}

export async function fetchNews(): Promise<NewsData> {
  const results = await Promise.allSettled(FEEDS.map(parseFeed));

  const seenLinks = new Set<string>();
  const allItems: NewsItem[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value) {
      if (!seenLinks.has(item.link)) {
        seenLinks.add(item.link);
        allItems.push(item);
      }
    }
  }

  const deduplicated = deduplicateByTitle(allItems);

  deduplicated.sort((a, b) => {
    if (!a.publishedAt) return 1;
    if (!b.publishedAt) return -1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });

  const topItems = deduplicated.slice(0, MAX_ITEMS);

  const { enrichedItems, keywords } = await enrichWithAI(topItems);

  const now = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tokyo",
  });

  saveNewsItems(enrichedItems).catch(() => {});
  if (keywords.length > 0) {
    saveKeywords(today, keywords).catch(() => {});
  }

  return {
    lastUpdated: now,
    items: enrichedItems,
    keywords,
  };
}
