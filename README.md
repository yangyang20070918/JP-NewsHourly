# JP NewsHourly 📰

毎時自動更新の日本語ニュースアグリゲーター。  
NHK・Yahoo! Japan の公開 RSS フィードから最新ニュースを取得し、美しい Web UI で配信します。

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Data:** RSS feeds parsed server-side (rss-parser)
- **Hosting:** Vercel (Free Tier)
- **Scheduling:** Vercel Cron Jobs (hourly ISR revalidation)

## Architecture

```
Browser → Vercel Edge Network
              │
              ▼
    Next.js Server Component (ISR, revalidate = 3600s)
              │
              ▼
    lib/fetch-news.ts (fetches 6 RSS feeds in parallel)
              │
              ▼
    Renders React components → returns HTML

Vercel Cron (hourly) → /api/revalidate → triggers ISR cache refresh
```

## News Sources

| Source | Category | Feed |
|--------|----------|------|
| NHK 主要ニュース | 総合 | RSS |
| Yahoo! Japan トピックス | 総合 | RSS |
| NHK 国際 | 国際 | RSS |
| NHK 経済 | 経済 | RSS |
| NHK 科学・文化 | 科学 | RSS |
| NHK スポーツ | スポーツ | RSS |

## Features

- **Server-Side Rendering** with Incremental Static Regeneration (ISR)
- **Hourly auto-update** via Vercel Cron Jobs
- **Dark / Light theme** with system preference detection
- **Category filtering** with item counts
- **Skeleton loading** states
- **Responsive** card-based layout (mobile-first)
- **Zero database** — RSS data fetched and cached at the edge

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build && npm start
```

## Deployment

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add `CRON_SECRET` environment variable
4. Deploy — Vercel Cron runs automatically every hour

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + ThemeProvider
│   ├── page.tsx                # Home (Server Component, ISR)
│   ├── loading.tsx             # Skeleton loading UI
│   └── api/revalidate/route.ts # Cron-triggered revalidation
├── components/
│   ├── header.tsx              # Top navigation
│   ├── news-grid.tsx           # News grid + filter state
│   ├── news-card.tsx           # Individual news card
│   ├── category-filter.tsx     # Category pills
│   ├── theme-toggle.tsx        # Dark/light toggle
│   └── footer.tsx              # Footer
└── lib/
    ├── fetch-news.ts           # RSS fetching logic
    ├── types.ts                # TypeScript interfaces
    ├── constants.ts            # Feed configs + constants
    └── utils.ts                # Utility functions
```
