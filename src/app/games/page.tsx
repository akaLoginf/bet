"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import FilterChips from "@/components/FilterChips";
import { formatGameTime } from "@/lib/mockData";
import type { Game } from "@/lib/mockData";

export default function GamesPage() {
  const [sport, setSport] = useState("All");
  const sports = ["All", "NBA", "NFL", "MLB", "NHL"];
  const activeSport = sport === "All" ? "nba" : sport.toLowerCase();

  const [allGames, setAllGames] = useState<{ sport: string; data: Game[] } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const loading = allGames === null || allGames.sport !== activeSport;
  const filtered = allGames?.data ?? [];

  useEffect(() => {
    let cancelled = false;

    const loadGames = () => {
      setApiError(null);
      fetch(`/api/odds/games?sport=${activeSport}`)
        .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
          if (cancelled) return;
          if (!ok) {
            setApiError(data?.error ?? "Failed to load games");
            setAllGames({ sport: activeSport, data: [] });
          } else {
            setAllGames({ sport: activeSport, data: Array.isArray(data) ? data : [] });
          }
        })
        .catch(() => {
          if (!cancelled) {
            setApiError("Network error — could not reach the server");
            setAllGames({ sport: activeSport, data: [] });
          }
        });
    };

    loadGames();
    const interval = setInterval(loadGames, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [activeSport]);

  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ background: "#0d0d0f" }}>
      <header className="flex items-center justify-between px-4 pt-12 pb-3">
        <h1 className="text-white font-bold text-xl">Games</h1>
        <div className="text-xs text-gray-500">
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
      </header>

      <div className="px-4 mb-4">
        <FilterChips filters={sports} active={sport} onChange={setSport} />
      </div>

      <div className="px-4 flex flex-col gap-3">
        {loading ? (
          <div className="text-gray-500 text-sm py-6 text-center">Loading games…</div>
        ) : apiError ? (
          <div className="rounded-2xl border p-5 text-center" style={{ background: "#141418", borderColor: "#ff6b2b44" }}>
            <div className="text-sm font-semibold mb-1" style={{ color: "#ff6b2b" }}>Unable to load games</div>
            <div className="text-gray-500 text-xs">{apiError}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 text-sm py-6 text-center">No games scheduled for this sport right now.</div>
        ) : (
          filtered.map((game) => (
            <Link key={game.id} href={`/games/${game.id}?sport=${game.sport}`}>
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
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
