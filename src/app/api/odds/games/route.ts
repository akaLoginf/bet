import { NextRequest, NextResponse } from "next/server";
import { fetchGames } from "@/lib/oddsApi";

export async function GET(req: NextRequest) {
  const sport = req.nextUrl.searchParams.get("sport") ?? "nba";
  try {
    const games = await fetchGames(sport);
    return NextResponse.json(games);
  } catch (err) {
    console.error("GET /api/odds/games error:", err);
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}
