"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Share2, X, Download } from "lucide-react";

interface ShareButtonProps {
  titles?: string[];
}

export function ShareButton({ titles }: ShareButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const fetchImage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/og", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titles: titles ?? [] }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch {
      const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
      setImageUrl(`/api/og?date=${today}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setShowPreview(true);
    fetchImage();
  };

  const handleClose = () => {
    setShowPreview(false);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    setDownloading(true);
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
      a.download = `jp-news-${today}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
        title="今日の簡報を共有"
      >
        <Share2 className="h-4 w-4" />
      </button>

      {showPreview && mounted && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="relative flex max-h-[85dvh] w-full max-w-sm flex-col rounded-2xl bg-card p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex shrink-0 items-center justify-between">
              <h3 className="text-sm font-bold text-card-foreground">
                今日のニュース簡報
              </h3>
              <button
                onClick={handleClose}
                className="rounded-lg p-1 text-muted-foreground hover:text-card-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                  画像を生成中...
                </div>
              ) : imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="今日のニュース"
                  className="w-full rounded-lg border border-border"
                />
              ) : null}
            </div>

            <div className="mt-3 flex shrink-0 gap-2">
              <button
                onClick={handleDownload}
                disabled={downloading || loading || !imageUrl}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {downloading ? "保存中..." : "画像を保存"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
