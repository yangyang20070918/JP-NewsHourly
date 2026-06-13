import { fetchNews } from "@/lib/fetch-news";
import { Header } from "@/components/header";
import { NewsGrid } from "@/components/news-grid";
import { Footer } from "@/components/footer";

export const revalidate = 3600;

export default async function Home() {
  const data = await fetchNews();

  return (
    <>
      <Header lastUpdated={data.lastUpdated} />
      <NewsGrid items={data.items} keywords={data.keywords} />
      <Footer />
    </>
  );
}
