"use client";

import { useState } from "react";
import { Share2, X, Download } from "lucide-react";

export function ShareButton() {
  const [showPreview, setShowPreview] = useState(false);

  const today = new Date()
    .toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
  const ogUrl = `/api/og?date=${today}`;

  return (
    <>
      <button
        onClick={() => setShowPreview(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
        title="今日の簡報を共有"
      >
        <Share2 className="h-4 w-4" />
      </button>

      {showPreview && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl bg-card p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-card-foreground">
                今日のニュース簡報
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-card-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ogUrl}
              alt="今日のニュース"
              className="w-full rounded-lg border border-border"
            />

            <div className="mt-3 flex gap-2">
              <a
                href={ogUrl}
                download={`jp-news-${today}.png`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <Download className="h-4 w-4" />
                画像を保存
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
