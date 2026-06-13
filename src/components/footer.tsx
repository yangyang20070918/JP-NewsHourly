import { Github, Rss } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border py-6 text-center text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-6">
        <p>
          Powered by Next.js &amp; Vercel — データは NHK・Yahoo! Japan の公開
          RSS から取得
        </p>
        <div className="flex items-center gap-4">
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-orange-500"
            title="RSS フィードを購読"
          >
            <Rss className="h-3.5 w-3.5" />
            RSS
          </a>
          <a
            href="https://github.com/yangyang20070918/JP-NewsHourly"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
