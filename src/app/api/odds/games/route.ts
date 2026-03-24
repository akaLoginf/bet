import { NextRequest, NextResponse } from "next/server";
import { fetchGames } from "@/lib/oddsApi";

export async function GET(req: NextRequest) {
  const sport = req.nextUrl.searchParams.get("sport") ?? "nba";

  try {
    const games = await fetchGames(sport);
    return NextResponse.json(games);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch games";
    console.error("GET /api/odds/games error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
