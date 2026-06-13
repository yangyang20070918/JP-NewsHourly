import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HistoryList } from "@/components/history-list";

export const revalidate = 3600;

export default function HistoryPage() {
  const now = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Header lastUpdated={now} />
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <h2 className="mb-6 text-xl font-bold text-foreground">
          過去のニュース
        </h2>
        <HistoryList />
      </div>
      <Footer />
    </>
  );
}
