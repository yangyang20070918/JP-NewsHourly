import type { FeedConfig, Category } from "./types";
export type { Category };

export const FEEDS: FeedConfig[] = [
  {
    name: "NHK 主要ニュース",
    url: "https://www.nhk.or.jp/rss/news/cat0.xml",
    source: "NHK",
    category: "総合",
  },
  {
    name: "Yahoo! 主要トピックス",
    url: "https://news.yahoo.co.jp/rss/topics/top-picks.xml",
    source: "Yahoo! Japan",
    category: "総合",
  },
  {
    name: "NHK 国際",
    url: "https://www.nhk.or.jp/rss/news/cat6.xml",
    source: "NHK",
    category: "国際",
  },
  {
    name: "NHK 経済",
    url: "https://www.nhk.or.jp/rss/news/cat5.xml",
    source: "NHK",
    category: "経済",
  },
  {
    name: "NHK 科学・文化",
    url: "https://www.nhk.or.jp/rss/news/cat3.xml",
    source: "NHK",
    category: "科学",
  },
  {
    name: "NHK スポーツ",
    url: "https://www.nhk.or.jp/rss/news/cat7.xml",
    source: "NHK",
    category: "スポーツ",
  },
];

export const MAX_ITEMS = 10;

export const ALL_CATEGORIES: Category[] = [
  "総合",
  "国際",
  "経済",
  "科学",
  "スポーツ",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  総合: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  国際: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  経済: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  科学: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  スポーツ: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export const CATEGORY_BORDER_COLORS: Record<Category, string> = {
  総合: "hover:border-blue-400",
  国際: "hover:border-purple-400",
  経済: "hover:border-emerald-400",
  科学: "hover:border-amber-400",
  スポーツ: "hover:border-red-400",
};
