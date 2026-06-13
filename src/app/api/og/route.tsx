import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const date =
    request.nextUrl.searchParams.get("date") ??
    new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });

  const displayDate = date.replace(/-/g, "/");

  const supabaseUrl = process.env.SUPABASE_URL ?? "";
  const supabaseKey = process.env.SUPABASE_ANON_KEY ?? "";

  let titles: string[] = [];

  if (supabaseUrl) {
    try {
      const startOfDay = `${date}T00:00:00+09:00`;
      const endOfDay = `${date}T23:59:59+09:00`;
      const url = `${supabaseUrl}/rest/v1/news_items?select=title&created_at=gte.${encodeURIComponent(startOfDay)}&created_at=lte.${encodeURIComponent(endOfDay)}&order=published_at.desc&limit=10`;
      const res = await fetch(url, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });
      if (res.ok) {
        const rows = (await res.json()) as { title: string }[];
        titles = rows.map((r) => r.title);
      }
    } catch {
      // fall through
    }
  }

  const newsItems = titles.length > 0
    ? titles.map((title, i) => ({
        num: `${i + 1}.`,
        title,
      }))
    : [{ num: "", title: "ニュースデータを取得中..." }];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#f1f5f9",
          padding: 40,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", marginBottom: 16 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#3b82f6" }}>
            JP NewsHourly
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 18,
            color: "#94a3b8",
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: "1px solid #334155",
          }}
        >
          {displayDate} のトップニュース
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            flex: 1,
          }}
        >
          {newsItems.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              {item.num && (
                <span style={{ color: "#94a3b8", fontWeight: 700, width: 24 }}>
                  {item.num}
                </span>
              )}
              <span style={{ fontSize: 15, fontWeight: 600 }}>
                {item.title}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #334155",
            paddingTop: 16,
            marginTop: 16,
          }}
        >
          <span style={{ fontSize: 12, color: "#64748b" }}>
            Powered by Next.js
          </span>
          <span style={{ fontSize: 12, color: "#3b82f6" }}>
            jp-news-hourly.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 1200,
    }
  );
}
