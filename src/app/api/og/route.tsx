import { NextResponse, type NextRequest } from "next/server";
import { getNewsByDate } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { ImageResponse } = await import("next/og");

    const date =
      request.nextUrl.searchParams.get("date") ??
      new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });

    const items = await getNewsByDate(date);
    const displayDate = date.replace(/-/g, "/");

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
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#3b82f6" }}>
              JP NewsHourly
            </span>
          </div>

          <div style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #334155" }}>
            {displayDate} のトップニュース
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
            {items.length === 0 ? (
              <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                Supabase設定後にニュースが表示されます
              </div>
            ) : (
              items.slice(0, 10).map((item, i) => (
                <div key={item.id} style={{ display: "flex", gap: "12px" }}>
                  <span style={{ color: "#94a3b8", fontWeight: 700, width: "24px" }}>{i + 1}.</span>
                  <span style={{ fontSize: "15px", fontWeight: 600 }}>{item.title}</span>
                </div>
              ))
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #334155", paddingTop: "16px", marginTop: "16px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Powered by Next.js</span>
            <span style={{ fontSize: "12px", color: "#3b82f6" }}>jp-news-hourly.vercel.app</span>
          </div>
        </div>
      ),
      { width: 600, height: 1200 }
    );
  } catch (err) {
    console.error("[OG] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
