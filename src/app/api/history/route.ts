import { NextResponse } from "next/server";
import { getNewsByDate } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "date parameter required" }, { status: 400 });
  }

  const items = await getNewsByDate(date);

  return NextResponse.json({ items });
}
