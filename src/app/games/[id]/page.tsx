"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Tabs from "@/components/Tabs";
import FilterChips from "@/components/FilterChips";
import PropInsightCard from "@/components/PropInsightCard";
import { formatGameTime } from "@/lib/mockData";
import type { Game, PropInsight } from "@/lib/mockData";

const GAME_TABS = ["Smart Signals", "Game Lines", "Player Props", "Injuries"];
const LINE_FILTERS = ["All", "Spread", "Moneyline", "Total"];

export default function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [game, setGame] = useState<Game | null | undefined>(undefined); // undefined = loading
  const [gameProps, setGameProps] = useState<PropInsight[]>([]);
  const [activeTab, setActiveTab] = useState("Smart Signals");
  const [lineFilter, setLineFilter] = useState("All");

  useEffect(() => {
    // Read the sport from the URL query string (window is available client-side)
    const sport = new URLSearchParams(window.location.search).get("sport") ?? "nba";

    fetch(`/api/odds/games?sport=${sport}`)
      .then((r) => r.json())
      .then((data: Game[]) => {
        const found = Array.isArray(data) ? data.find((g) => g.id === id) : null;
        setGame(found ?? null);
      })
      .catch(() => setGame(null));

    fetch(`/api/odds/props?sport=${sport}`)
      .then((r) => r.json())
      .then((data: PropInsight[]) =>
        setGameProps(Array.isArray(data) ? data.filter((p) => p.gameId === id) : [])
      )
      .catch(() => setGameProps([]));
  }, [id]);

  // Still loading
  if (game === undefined) {
    return (
      <div className="flex flex-col min-h-screen pb-20 items-center justify-center" style={{ background: "#0d0d0f" }}>
        <div className="text-gray-500 text-sm">Loading game…</div>
      </div>
    );
  }

  // Game not found
  if (game === null) return notFound();

  const awayWin = 100 - (game.winChanceHome ?? 50);
  const homeWin = game.winChanceHome ?? 50;

  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ background: "#0d0d0f" }}>
      {/* Matchup header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0d1a2e 0%, #0d0d0f 100%)",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        {/* Back */}
        <div className="flex items-center px-4 pt-12 pb-2">
          <Link href="/games" className="text-gray-400 text-sm flex items-center gap-1">
            ← Back
          </Link>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Away team */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-black text-white"
              style={{ background: game.awayTeam.primaryColor, boxShadow: `0 0 20px ${game.awayTeam.primaryColor}44` }}
            >
              {game.awayTeam.abbreviation}
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-sm">{game.awayTeam.abbreviation}</div>
              <div className="text-gray-500 text-xs">Away</div>
            </div>
          </div>

          {/* Center info */}
          <div className="flex flex-col items-center">
            <div className="text-gray-400 text-xs mb-1">{formatGameTime(game.gameTime)}</div>
            <div className="text-white font-black text-xl">VS</div>
            <div className="text-gray-500 text-xs mt-1">
                {new Date(game.gameTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
          </div>

          {/* Home team */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-black text-white"
              style={{ background: game.homeTeam.primaryColor, boxShadow: `0 0 20px ${game.homeTeam.primaryColor}44` }}
            >
              {game.homeTeam.abbreviation}
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-sm">{game.homeTeam.abbreviation}</div>
              <div className="text-gray-500 text-xs">Home</div>
            </div>
          </div>
        </div>

        {/* Win probability bar */}
        <div className="px-6 pb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{game.awayTeam.abbreviation} Win: <span className="text-white font-semibold">{awayWin}%</span></span>
            <span>{game.homeTeam.abbreviation} Win: <span className="text-white font-semibold">{homeWin}%</span></span>
          </div>
          <div className="h-2 rounded-full bg-gray-800 overflow-hidden flex">
            <div
              className="h-full rounded-full"
              style={{ width: `${awayWin}%`, background: `linear-gradient(90deg, #39ff14, #00cc44)` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs tabs={GAME_TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab content */}
      <div className="flex-1 px-4 pt-4">
        {activeTab === "Smart Signals" && (
          <div className="flex flex-col gap-3">
            {/* Signal cards */}
            <div
              className="rounded-2xl border p-4"
              style={{ background: "#141418", borderColor: "#39ff1433" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#39ff1422", color: "#39ff14" }}>
                  ⚡ Model Signal
                </span>
              </div>
              <div className="text-white font-semibold mb-1">
                {game.awayTeam.abbreviation} dominant on the road
              </div>
              <div className="text-gray-400 text-xs">
                {game.awayTeam.name} ranks top-3 in road net rating this season with a {game.modelEdgeSpread}% model confidence edge on the spread.
              </div>
              <div className="mt-3 flex gap-4">
                <div>
                  <div className="text-gray-500 text-xs">Model Edge</div>
                  <div className="font-bold" style={{ color: "#39ff14" }}>{game.modelEdgeSpread}%</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Win Chance</div>
                  <div className="font-bold text-white">{awayWin}%</div>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl border p-4"
              style={{ background: "#141418", borderColor: "#ff6b2b33" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#ff6b2b22", color: "#ff6b2b" }}>
                  📊 Trend Alert
                </span>
              </div>
              <div className="text-white font-semibold mb-1">
                Total trending over in recent matchups
              </div>
              <div className="text-gray-400 text-xs">
                Both teams combined for 230+ in their last 3 meetings. Model projects {game.total} total with {game.modelEdgeTotal}% confidence.
              </div>
              <div className="mt-3 flex gap-4">
                <div>
                  <div className="text-gray-500 text-xs">Total Line</div>
                  <div className="font-bold text-white">{game.total}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Confidence</div>
                  <div className="font-bold" style={{ color: "#ff6b2b" }}>{game.modelEdgeTotal}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Game Lines" && (
          <div>
            <div className="mb-4">
              <FilterChips filters={LINE_FILTERS} active={lineFilter} onChange={setLineFilter} />
            </div>
            <div className="flex flex-col gap-3">
              {(lineFilter === "All" || lineFilter === "Spread") && (
                <div
                  className="rounded-2xl border p-4"
                  style={{ background: "#141418", borderColor: "#222228" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Spread</div>
                      <div className="text-white font-bold text-lg">{game.spread}</div>
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{ background: "#39ff1422", color: "#39ff14", border: "1px solid #39ff1444" }}
                    >
                      {game.modelEdgeSpread}% model edge
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${game.modelEdgeSpread}%`, background: "#39ff14" }}
                    />
                  </div>
                </div>
              )}

              {(lineFilter === "All" || lineFilter === "Moneyline") && (
                <div
                  className="rounded-2xl border p-4"
                  style={{ background: "#141418", borderColor: "#222228" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-gray-400 text-xs mb-1">
                        {game.homeTeam.abbreviation} Moneyline
                      </div>
                      <div className="text-white font-bold text-lg">{game.moneylineHome}</div>
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{ background: "#ff6b2b22", color: "#ff6b2b", border: "1px solid #ff6b2b44" }}
                    >
                      Win chance: {homeWin}%
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${homeWin}%`, background: "#ff6b2b" }}
                    />
                  </div>
                </div>
              )}

              {(lineFilter === "All" || lineFilter === "Total") && (
                <div
                  className="rounded-2xl border p-4"
                  style={{ background: "#141418", borderColor: "#222228" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Over/Under Total</div>
                      <div className="text-white font-bold text-lg">{game.total}</div>
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{ background: "#39ff1422", color: "#39ff14", border: "1px solid #39ff1444" }}
                    >
                      {game.modelEdgeTotal}% confidence
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${game.modelEdgeTotal}%`, background: "#39ff14" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Player Props" && (
          <div className="flex flex-col gap-3">
            {gameProps.length > 0 ? (
              gameProps.map((prop) => <PropInsightCard key={prop.id} prop={prop} />)
            ) : (
              <div
                className="rounded-2xl border p-6 text-center"
                style={{ background: "#141418", borderColor: "#222228" }}
              >
                <div className="text-gray-400 text-sm">
                  No prop insights available for this game yet.
                </div>
                <Link href="/props" className="text-xs mt-2 block" style={{ color: "#39ff14" }}>
                  Browse all props →
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "Injuries" && (
          <div className="flex flex-col gap-3">
            {[
              { player: "Joel Embiid", team: game.homeTeam.abbreviation, status: "Questionable", reason: "Knee — Game-time decision" },
              { player: "Paul George", team: game.awayTeam.abbreviation, status: "Available", reason: "Full practice" },
            ].map((injury) => (
              <div
                key={injury.player}
                className="rounded-2xl border p-4 flex items-center justify-between"
                style={{ background: "#141418", borderColor: "#222228" }}
              >
                <div>
                  <div className="text-white font-semibold text-sm">{injury.player}</div>
                  <div className="text-gray-500 text-xs">{injury.team} · {injury.reason}</div>
                </div>
                <div
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: injury.status === "Available" ? "#39ff1422" : "#ff6b2b22",
                    color: injury.status === "Available" ? "#39ff14" : "#ff6b2b",
                  }}
                >
                  {injury.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
