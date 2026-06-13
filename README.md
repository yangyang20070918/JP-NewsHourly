# JP NewsHourly

Automated Japanese news aggregator with AI enrichment.

Live: https://jp-news-hourly.vercel.app

---

## Overview

| Item | Detail |
|------|--------|
| Stack | Next.js 15 + TypeScript + Tailwind CSS 4 + Supabase + Gemini AI |
| Data Sources | NHK (5 feeds) + Yahoo! Japan (1 feed) |
| Hosting | Vercel (Hobby plan, zero cost) |
| Update | Vercel Cron (daily) + ISR (hourly on-demand) |

---

## Features

### 1. Multi-Source RSS Scraping

6 RSS feeds fetched in parallel via `Promise.allSettled` with fault tolerance (one feed failing doesn't affect others).

| Source | Category | Feed URL |
|--------|----------|----------|
| NHK Main | General | `nhk.or.jp/rss/news/cat0.xml` |
| Yahoo! Japan | General | `news.yahoo.co.jp/rss/topics/top-picks.xml` |
| NHK International | International | `nhk.or.jp/rss/news/cat6.xml` |
| NHK Economy | Economy | `nhk.or.jp/rss/news/cat5.xml` |
| NHK Science | Science | `nhk.or.jp/rss/news/cat3.xml` |
| NHK Sports | Sports | `nhk.or.jp/rss/news/cat7.xml` |

**Tech:** `rss-parser` npm package, custom `User-Agent` header, 15s timeout per feed.

### 2. Two-Layer Title Deduplication

- **Layer 1 — URL dedup:** `Set<string>` removes exact same links across feeds.
- **Layer 2 — Title similarity:** Bigram Jaccard algorithm detects different-URL articles reporting the same story. Titles are split into character bigram sets, Jaccard similarity > 0.4 = duplicate. Keeps the version with the longer summary.

**Tech:** Pure TypeScript — `getBigrams()`, `bigramJaccard()`, `deduplicateByTitle()`. No external dependency.

### 3. AI Enrichment (Gemini)

One batch API call processes all 10 titles simultaneously for three tasks:

- **Furigana (reading aid):** Kanji annotated with `<ruby>` HTML tags, e.g. `<ruby>経済<rt>けいざい</rt></ruby>`
- **Chinese translation:** One-line simplified Chinese translation per title
- **Trending keywords:** Top 5 keywords extracted from all titles (people, places, organizations, themes)

**Tech:** `@google/genai` SDK → `gemini-2.5-flash` model, structured JSON output via `responseMimeType: "application/json"`. Graceful degradation — if API fails, page renders normally without enrichment.

### 4. Persistent History Storage (Supabase)

PostgreSQL database stores all fetched news for historical browsing.

**Tables:**
- `news_items` — id, title, title_zh, furigana_title, link, summary, source, category, published_at, created_at (upsert on id)
- `daily_keywords` — date (PK), keywords (JSONB array)

**Tech:** `@supabase/supabase-js`, Row Level Security enabled, snake_case DB ↔ camelCase TypeScript mapping. Graceful null handling when Supabase is not configured.

### 5. Relative Time + Read Status

- **Relative time:** `date-fns` `formatDistanceToNow` with Japanese locale — displays as "29分前", "約1時間前"
- **Read tracking:** Click on title → `localStorage.setItem("read:" + id, "1")` → card dims to 50% opacity

**Tech:** `date-fns` v4 + `ja` locale. `publishedAt` field stores ISO 8601 for accurate time calculation.

### 6. Category Filter + Keyword Filter

- **Category tabs:** "All" + 5 category buttons with live count badges. `useMemo` for filtered array.
- **HOT keywords:** Clickable keyword badges filter news by title/summary match. Selecting a keyword resets category to "All" to avoid empty intersections.
- **Furigana toggle:** Pink toggle button to show/hide ruby annotations globally.

### 7. OG Share Image

Server-side PNG generation (600x1200) with dark gradient background, date header, numbered news titles, and site URL.

**Tech:** `@vercel/og` (Satori engine), API Route at `/api/og`. Share button opens modal with image preview and download button.

### 8. RSS Feed Output

Standard RSS 2.0 XML with `atom:link` self-reference. Custom `escapeXml()` for safe XML entity encoding.

**Endpoint:** `/feed.xml` with `Cache-Control: s-maxage=3600, stale-while-revalidate`. Auto-discovery via `<link rel="alternate">` in layout head.

### 9. Dark / Light Mode

System-aware theme switching (system / light / dark) with `next-themes`.

**CSS architecture:** CSS custom properties in `:root` (light) and `.dark` (dark), bridged to Tailwind via `@theme inline { --color-background: var(--bg); }`. This enables runtime theme switching while keeping Tailwind's utility-first approach.

### 10. Automated Updates

- **Vercel Cron Job:** Daily at UTC 08:00, calls `/api/revalidate` with Bearer token auth (`CRON_SECRET`)
- **ISR (Incremental Static Regeneration):** `revalidate = 3600` — when a visitor loads the page and cache is > 1 hour old, Next.js regenerates in the background
- **Result:** Daily guaranteed update + near-hourly updates whenever there's traffic

---

## Tech Stack

### Framework & Runtime

| Tech | Version | Purpose |
|------|---------|---------|
| Next.js | 15.3 | Full-stack React framework — App Router, Server Components, ISR, API Routes, Streaming SSR |
| React | 19.1 | UI library — Server Components (pages) + Client Components (interactive cards) |
| TypeScript | 5.8 | Type safety across the entire project |

### Styling & UI

| Tech | Version | Purpose |
|------|---------|---------|
| Tailwind CSS | 4.1 | Utility-first CSS — `@theme inline` design tokens, `@custom-variant dark` |
| PostCSS | 8.5 | CSS processing via `@tailwindcss/postcss` plugin |
| clsx + tailwind-merge | 2.1 / 3.3 | Combined as `cn()` utility for conditional + conflict-free class merging |
| Lucide React | 0.513 | SVG icon library — Newspaper, History, ExternalLink, Sun, Moon, Rss, Github |
| next-themes | 0.4.6 | Theme management — system/light/dark with `class` attribute strategy |
| Noto Sans JP | Google Fonts | Japanese font, weights 400-700 |

### Data & AI

| Tech | Version | Purpose |
|------|---------|---------|
| rss-parser | 3.13 | XML RSS feed parsing |
| date-fns | 4.4 | Date formatting with `ja` locale |
| @google/genai | 2.8 | Gemini API SDK — structured JSON output |
| @supabase/supabase-js | 2.108 | Supabase client — PostgreSQL CRUD + RLS |

### Image & Feed Generation

| Tech | Version | Purpose |
|------|---------|---------|
| @vercel/og | 0.11 | OG image generation — Satori engine, JSX → PNG |
| RSS 2.0 XML | — | Hand-crafted XML with proper entity escaping |

### Deployment & DevOps

| Tech | Purpose |
|------|---------|
| Vercel | Cloud deployment — auto-deploy from GitHub, Serverless Functions |
| Vercel Cron Jobs | Daily scheduled ISR cache refresh with Bearer token auth |
| GitHub | Source code hosting — push triggers Vercel auto-deploy |
| ESLint | Code quality — `eslint-config-next` ruleset |

---

## Architecture

```
[NHK RSS x 5] + [Yahoo RSS x 1]
        |
        v  rss-parser (Promise.allSettled)
   6 feeds fetched in parallel
        |
        v  URL dedup (Set)
        v  Title dedup (Bigram Jaccard > 0.4)
        v  Sort by time -> Top 10
        |
        v  Gemini 2.5 Flash (single batch API call)
   +----+------------+
   Furigana  Translation  Keywords x 5
   |
   v  Supabase PostgreSQL (upsert)
   Save to news_items + daily_keywords
   |
   v  Next.js Server Component (ISR revalidate=3600)
   Render HTML -> Vercel CDN cache
        |
   +----+------------+
   |                 |
 Pages            API Routes
 - Header          - /api/og -> PNG image
 - CategoryFilter  - /api/history -> JSON
 - TrendingKeywords- /feed.xml -> RSS XML
 - NewsGrid        - /api/revalidate -> Cron
 |  - NewsCard x10
 - Footer
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, ThemeProvider, metadata, RSS auto-discovery
│   ├── page.tsx                # Home: Server Component + ISR, calls fetchNews()
│   ├── loading.tsx             # Skeleton loading: Suspense fallback with pulse animation
│   ├── globals.css             # Global styles: Tailwind, CSS variable dark mode, animations
│   ├── history/page.tsx        # History page: Server Component
│   ├── api/
│   │   ├── og/route.tsx        # OG image generation API
│   │   ├── history/route.ts    # History query API
│   │   └── revalidate/route.ts # Cron-triggered ISR refresh
│   └── feed.xml/route.ts      # RSS 2.0 XML feed
├── components/
│   ├── header.tsx              # Top bar: logo, timestamps, history/share/theme buttons
│   ├── news-grid.tsx           # News grid: filter state management (category/keyword/furigana)
│   ├── news-card.tsx           # News card: relative time, read status, furigana, translation
│   ├── category-filter.tsx     # Category filter bar + furigana toggle
│   ├── trending-keywords.tsx   # HOT keyword badges
│   ├── share-button.tsx        # Share button + preview modal
│   ├── history-list.tsx        # History news list + date picker
│   ├── theme-toggle.tsx        # Dark/light toggle button
│   └── footer.tsx              # Footer: RSS link, GitHub link
└── lib/
    ├── types.ts                # Core types: NewsItem, FeedConfig, Category, NewsData
    ├── constants.ts            # Config: 6 feed URLs, category colors, MAX_ITEMS
    ├── fetch-news.ts           # Data pipeline: fetch -> dedup -> sort -> AI -> store
    ├── ai-enrich.ts            # Gemini API: furigana + translation + keywords
    ├── supabase.ts             # Supabase client: CRUD + graceful null handling
    └── utils.ts                # Utility: cn() (clsx + tailwind-merge)
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build && npm start
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx
GEMINI_API_KEY=your-gemini-api-key
CRON_SECRET=your-secret-here
```

All services are optional — the app works without Supabase (no history) and without Gemini (no furigana/translation/keywords).

## Deployment

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add 4 environment variables (SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY, CRON_SECRET)
4. Deploy — Vercel Cron runs automatically
