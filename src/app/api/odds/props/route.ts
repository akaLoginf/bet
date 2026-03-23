import { NextRequest, NextResponse } from "next/server";
import { fetchProps } from "@/lib/oddsApi";

export async function GET(req: NextRequest) {
  const sport = req.nextUrl.searchParams.get("sport") ?? "nba";
  try {
    const props = await fetchProps(sport);
    return NextResponse.json(props);
  } catch (err) {
    console.error("GET /api/odds/props error:", err);
    return NextResponse.json({ error: "Failed to fetch props" }, { status: 500 });
  }
}
