"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import FilterChips from "@/components/FilterChips";
import { GAMES, formatGameTime } from "@/lib/mockData";

export default function GamesPage() {
  const [sport, setSport] = useState("All");
  const sports = ["All", "NBA", "NFL", "MLB", "Golf"];

  const filtered = sport === "All"
    ? GAMES
    : GAMES.filter((g) => g.sport === sport.toLowerCase());

  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ background: "#0d0d0f" }}>
      <header className="flex items-center justify-between px-4 pt-12 pb-3">
        <h1 className="text-white font-bold text-xl">Games</h1>
        <div className="text-xs text-gray-500">Mar 24</div>
      </header>

      <div className="px-4 mb-4">
        <FilterChips filters={sports} active={sport} onChange={setSport} />
      </div>

      <div className="px-4 flex flex-col gap-3">
        {filtered.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`}>
            <div
              className="rounded-2xl border p-4 flex items-center justify-between"
              style={{ background: "#141418", borderColor: "#222228" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: game.awayTeam.primaryColor }}
                >
                  {game.awayTeam.abbreviation}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    {game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation}
                  </div>
                  <div className="text-gray-500 text-xs">{formatGameTime(game.gameTime)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Spread</div>
                  <div className="text-white text-sm font-medium">{game.spread}</div>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "#39ff1422", color: "#39ff14", border: "1px solid #39ff1444" }}
                >
                  →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
