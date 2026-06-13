import Link from "next/link";
import { Newspaper, History } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { ShareButton } from "./share-button";

interface HeaderProps {
  lastUpdated: string;
  titles?: string[];
}

export function Header({ lastUpdated, titles }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Newspaper className="h-5 w-5" />
          </div>
          <div>
            <Link href="/">
              <h1 className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-lg font-bold tracking-tight text-transparent sm:text-xl">
                JP NewsHourly
              </h1>
            </Link>
            <p className="text-xs text-muted-foreground">
              日本ニュース速報 — 毎時更新
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            最終更新: {lastUpdated}
          </span>
          <Link
            href="/history"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
            title="過去のニュース"
          >
            <History className="h-4 w-4" />
          </Link>
          <ShareButton titles={titles} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
