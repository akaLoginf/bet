import { NextRequest, NextResponse } from "next/server";
import { fetchProps } from "@/lib/oddsApi";

export async function GET(req: NextRequest) {
  const sport = req.nextUrl.searchParams.get("sport") ?? "nba";

  try {
    const props = await fetchProps(sport);
    return NextResponse.json(props);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch props";
    console.error("GET /api/odds/props error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
