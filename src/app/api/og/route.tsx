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
      // fall through to empty state
    }
  }

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
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "28px", fontWeight: 700, color: "#3b82f6" }}>
            JP NewsHourly
          </span>
        </div>

        <div
          style={{
            fontSize: "18px",
            color: "#94a3b8",
            marginBottom: "24px",
            paddingBottom: "16px",
            borderBottom: "1px solid #334155",
          }}
        >
          {displayDate} のトップニュース
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            flex: 1,
          }}
        >
          {titles.length === 0 ? (
            <div
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
              }}
            >
              ニュースデータを取得中...
            </div>
          ) : (
            titles.map((title, i) => (
              <div key={i} style={{ display: "flex", gap: "12px" }}>
                <span
                  style={{ color: "#94a3b8", fontWeight: 700, width: "24px" }}
                >
                  {i + 1}.
                </span>
                <span style={{ fontSize: "15px", fontWeight: 600 }}>
                  {title}
                </span>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #334155",
            paddingTop: "16px",
            marginTop: "16px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Powered by Next.js
          </span>
          <span style={{ fontSize: "12px", color: "#3b82f6" }}>
            jp-news-hourly.vercel.app
          </span>
        </div>
      </div>
    ),
    { width: 600, height: 1200 }
  );
}
