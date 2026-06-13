export interface NewsItem {
  id: string;
  title: string;
  titleZh?: string;
  furiganaTitle?: string;
  link: string;
  summary: string;
  source: string;
  category: Category;
  published: string;
  publishedAt?: string;
}

export interface FeedConfig {
  name: string;
  url: string;
  source: string;
  category: Category;
}

export type Category = "総合" | "国際" | "経済" | "科学" | "スポーツ";

export interface NewsData {
  lastUpdated: string;
  items: NewsItem[];
  keywords: string[];
}
