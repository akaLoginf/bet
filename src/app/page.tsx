"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import SportSelector from "@/components/SportSelector";
import GameCard from "@/components/GameCard";
import PropInsightCard from "@/components/PropInsightCard";
import { TOP_MODELS } from "@/lib/mockData";
import type { Game, PropInsight } from "@/lib/mockData";

type GamesState = { sport: string; data: Game[] } | null;
type PropsState = { sport: string; data: PropInsight[] } | null;

export default function HomePage() {
  const [sport, setSport] = useState("nba");
  const [gamesState, setGamesState] = useState<GamesState>(null);
  const [propsState, setPropsState] = useState<PropsState>(null);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [propsError, setPropsError] = useState<string | null>(null);

  const gamesLoading = gamesState === null || gamesState.sport !== sport;
  const propsLoading = propsState === null || propsState.sport !== sport;
  const games = gamesState?.data ?? [];
  const props = propsState?.data ?? [];

  useEffect(() => {
    let cancelled = false;
    setGamesError(null);
    fetch(`/api/odds/games?sport=${sport}`)
      .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setGamesError(data?.error ?? "Failed to load games");
          setGamesState({ sport, data: [] });
        } else {
          setGamesState({ sport, data: Array.isArray(data) ? data : [] });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGamesError("Network error");
          setGamesState({ sport, data: [] });
        }
      });
    return () => { cancelled = true; };
  }, [sport]);

  useEffect(() => {
    let cancelled = false;
    setPropsError(null);
    fetch(`/api/odds/props?sport=${sport}`)
      .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setPropsError(data?.error ?? "Failed to load props");
          setPropsState({ sport, data: [] });
        } else {
          setPropsState({ sport, data: Array.isArray(data) ? data : [] });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPropsError("Network error");
          setPropsState({ sport, data: [] });
        }
      });
    return () => { cancelled = true; };
  }, [sport]);

  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ background: "#0d0d0f" }}>
      {/* Top header */}
      <header className="flex items-center justify-between px-4 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: "linear-gradient(135deg, #39ff14, #00aa44)", color: "#000" }}
          >
            P
          </div>
          <span className="text-white font-bold text-lg tracking-tight">PropPulse</span>
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: "#1e1e24", color: "#aaa", border: "1px solid #333" }}
        >
          JD
        </div>
      </header>

      {/* Sport selector */}
      <SportSelector selected={sport} onChange={setSport} />

      {/* Promo banner */}
      <div className="px-4 mb-4">
        <div
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a2a1a 0%, #0d1a1a 100%)",
            border: "1px solid #39ff1433",
          }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
            style={{ background: "#39ff14", filter: "blur(30px)" }} />
          <div className="text-[10px] font-semibold text-green-400 mb-1 uppercase tracking-wider">
            ⚡ Getting Started
          </div>
          <div className="text-white font-bold text-base mb-1">Explore Prop Analytics</div>
          <div className="text-gray-400 text-xs mb-3">
            Dive into projection models, trend data, and matchup insights for today&apos;s games.
          </div>
          <button
            className="text-xs font-semibold px-4 py-1.5 rounded-full"
            style={{ background: "#39ff14", color: "#000" }}
          >
            View Tutorials
          </button>
        </div>
      </div>

      {/* Upcoming Games */}
      <section className="mb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-white font-bold text-base">Upcoming Games</h2>
          <Link href="/games" className="text-xs font-medium" style={{ color: "#39ff14" }}>
            See all →
          </Link>
        </div>
        {gamesLoading ? (
          <div className="px-4 text-gray-500 text-sm">Loading games…</div>
        ) : gamesError ? (
          <div className="px-4">
            <div className="rounded-2xl border p-4 text-center" style={{ background: "#141418", borderColor: "#ff6b2b44" }}>
              <div className="text-xs font-semibold mb-1" style={{ color: "#ff6b2b" }}>Unable to load games</div>
              <div className="text-gray-500 text-xs">{gamesError}</div>
            </div>
          </div>
        ) : games.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="px-4 text-gray-500 text-sm">No games available for this sport.</div>
        )}
      </section>

      {/* Top Models */}
      <section className="mb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-white font-bold text-base">Top Models</h2>
          <Link href="/models" className="text-xs font-medium" style={{ color: "#39ff14" }}>
            See all →
          </Link>
        </div>
        <div className="px-4 flex flex-col gap-2">
          {TOP_MODELS.map((model) => (
            <div
              key={model.id}
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ background: "#141418", borderColor: "#222228" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: "#1e1e24" }}
              >
                {model.badge}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-semibold truncate">{model.name}</div>
                <div className="text-gray-500 text-xs truncate">{model.description}</div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <div className="text-xs font-bold" style={{ color: "#39ff14" }}>
                  {model.accuracy}
                </div>
                <div className="text-[10px] text-gray-500">{model.sport}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Filters / Today's Insights */}
      <section className="mb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-white font-bold text-base">Today&apos;s Insights</h2>
          <Link href="/props" className="text-xs font-medium" style={{ color: "#39ff14" }}>
            See all →
          </Link>
        </div>

        {/* Quick filter banner */}
        <div className="px-4 mb-3">
          <Link href="/props">
            <div
              className="rounded-2xl p-4 flex items-center gap-3 border"
              style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                borderColor: "#ff6b2b44",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "#ff6b2b22" }}
              >
                🎯
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Smart Signal Finder</div>
                <div className="text-gray-500 text-xs">See today&apos;s high-confidence prop insights</div>
              </div>
              <div className="ml-auto" style={{ color: "#ff6b2b" }}>→</div>
            </div>
          </Link>
        </div>

        <div className="px-4 flex flex-col gap-3">
          {propsLoading ? (
            <div className="text-gray-500 text-sm">Loading props…</div>
          ) : propsError ? (
            <div className="rounded-2xl border p-4 text-center" style={{ background: "#141418", borderColor: "#ff6b2b44" }}>
              <div className="text-xs font-semibold mb-1" style={{ color: "#ff6b2b" }}>Unable to load props</div>
              <div className="text-gray-500 text-xs">{propsError}</div>
            </div>
          ) : props.length > 0 ? (
            props.slice(0, 3).map((prop) => (
              <PropInsightCard key={prop.id} prop={prop} />
            ))
          ) : (
            <div className="text-gray-500 text-sm">No props available right now.</div>
          )}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
