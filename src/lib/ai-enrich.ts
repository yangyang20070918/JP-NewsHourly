import { GoogleGenAI } from "@google/genai";
import type { NewsItem } from "./types";

const apiKey = process.env.GEMINI_API_KEY ?? "";

interface AIEnrichResult {
  items: { titleZh: string; furiganaTitle: string }[];
  keywords: string[];
}

export async function enrichWithAI(
  items: NewsItem[]
): Promise<{ enrichedItems: NewsItem[]; keywords: string[] }> {
  if (!apiKey || items.length === 0) {
    return { enrichedItems: items, keywords: [] };
  }

  const titles = items.map((item, i) => `${i + 1}. ${item.title}`).join("\n");

  const prompt = `以下は日本のニュースのタイトルリストです。各タイトルについて以下を生成してください：

1. furiganaTitle: 漢字にふりがなを付けたHTML。HTMLの<ruby>タグ形式で出力。
   例: <ruby>経済<rt>けいざい</rt></ruby>の<ruby>動向<rt>どうこう</rt></ruby>
   注意: ひらがな・カタカナ・英数字・記号にはrubyタグ不要。漢字のみ。

2. titleZh: 1文の簡潔な中国語翻訳

3. keywords: 全タイトルから抽出した上位5つのトレンドキーワード（人名・地名・組織名・重要テーマ）

タイトル:
${titles}

以下のJSON形式で回答してください（JSONのみ、他のテキスト不要）:
{
  "items": [
    {"furiganaTitle": "...", "titleZh": "..."},
    ...
  ],
  "keywords": ["キーワード1", "キーワード2", ...]
}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text ?? "";
    const parsed: AIEnrichResult = JSON.parse(text);

    const enrichedItems = items.map((item, i) => ({
      ...item,
      titleZh: parsed.items?.[i]?.titleZh ?? undefined,
      furiganaTitle: parsed.items?.[i]?.furiganaTitle ?? undefined,
    }));

    return {
      enrichedItems,
      keywords: parsed.keywords ?? [],
    };
  } catch (err) {
    console.warn("[WARN] Gemini AI enrichment failed:", err);
    return { enrichedItems: items, keywords: [] };
  }
}
