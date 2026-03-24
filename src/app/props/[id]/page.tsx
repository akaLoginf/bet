"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Tabs from "@/components/Tabs";
import FilterChips from "@/components/FilterChips";
import TrendChart from "@/components/TrendChart";
import { formatGameTime, formatGameDate } from "@/lib/mockData";
import type { PropInsight } from "@/lib/mockData";

const PROP_TABS = ["Trends", "Insights", "Splits", "Injuries"];
const TREND_FILTERS = ["Home + Away", "L5", "L10", "L20"];

export default function PropDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [prop, setProp] = useState<PropInsight | null | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("Trends");
  const [trendFilter, setTrendFilter] = useState("L10");

  useEffect(() => {
    fetch("/api/odds/props?sport=nba")
      .then((r) => r.json())
      .then((data: PropInsight[]) => {
        const found = Array.isArray(data) ? data.find((p) => p.id === id) : null;
        setProp(found ?? null);
      })
      .catch(() => setProp(null));
  }, [id]);

  if (prop === undefined) {
    return (
      <div className="flex flex-col min-h-screen pb-20 items-center justify-center" style={{ background: "#0d0d0f" }}>
        <div className="text-gray-500 text-sm">Loading prop…</div>
      </div>
    );
  }

  if (prop === null) return notFound();

  const isOver = prop.direction === "over";
  const accentColor = isOver ? "#39ff14" : "#ff6b2b";

  const getFilteredData = () => {
    switch (trendFilter) {
      case "L5": return prop.last10.slice(-5);
      case "L10": return prop.last10;
      case "L20": return [...prop.last10, ...prop.last10.map((v) => Math.round(v * (0.9 + Math.random() * 0.2)))];
      default: return prop.last10;
    }
  };

  const filteredData = getFilteredData();
  const hitRate =
    trendFilter === "L5" ? prop.l5HitRate :
    trendFilter === "L10" ? prop.l10HitRate :
    trendFilter === "L20" ? prop.l20HitRate :
    prop.homeAwayHitRate;

  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ background: "#0d0d0f" }}>
      {/* Player header */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0d1a0d 0%, #0d0d0f 100%)" }}
      >
        <div className="px-4 pt-12 pb-2">
          <Link href="/props" className="text-gray-400 text-sm flex items-center gap-1">
            ← Back
          </Link>
        </div>

        <div className="px-4 pb-5 pt-2">
          <div className="flex items-start gap-4">
            {/* Player avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #1a3a5c, #0d1a2e)",
                border: "2px solid #39ff1433",
              }}
            >
              {prop.playerName.split(" ").map((n) => n[0]).join("")}
            </div>

            <div className="flex-1">
              <div className="text-white font-bold text-lg leading-tight">{prop.playerName}</div>
              <div className="text-gray-400 text-sm">
                {prop.position} · {prop.team}
              </div>
              <div
                className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold"
                style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
              >
                {isOver ? "Over" : "Under"} {prop.line} {prop.propType}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
            <span>vs {prop.opponent}</span>
            <span>·</span>
            <span>{formatGameDate(prop.gameTime)}</span>
            <span>·</span>
            <span>{formatGameTime(prop.gameTime)}</span>
          </div>

          {/* Key metrics */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div
              className="rounded-xl p-2.5 text-center"
              style={{ background: "#141418", border: "1px solid #222228" }}
            >
              <div className="text-gray-500 text-[10px] mb-0.5">Projection</div>
              <div className="text-white font-bold text-base">{prop.projection}</div>
            </div>
            <div
              className="rounded-xl p-2.5 text-center"
              style={{ background: `${accentColor}11`, border: `1px solid ${accentColor}33` }}
            >
              <div className="text-gray-400 text-[10px] mb-0.5">Confidence</div>
              <div className="font-bold text-base" style={{ color: accentColor }}>{prop.confidence}%</div>
            </div>
            <div
              className="rounded-xl p-2.5 text-center"
              style={{ background: "#141418", border: "1px solid #222228" }}
            >
              <div className="text-gray-500 text-[10px] mb-0.5">Hit Rate</div>
              <div className="text-white font-bold text-base">{Math.round(prop.hitRate * 100)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs tabs={PROP_TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab content */}
      <div className="flex-1 px-4 pt-4">
        {activeTab === "Trends" && (
          <div>
            {/* Trend filter */}
            <div className="mb-4">
              <FilterChips
                filters={TREND_FILTERS}
                active={trendFilter}
                onChange={setTrendFilter}
                accentColor={accentColor}
              />
            </div>

            {/* Hit rate stat */}
            <div
              className="rounded-2xl border p-3 mb-4 flex items-center justify-between"
              style={{ background: "#141418", borderColor: "#222228" }}
            >
              <div>
                <div className="text-gray-400 text-xs">{trendFilter} Hit Rate</div>
                <div className="text-white font-bold text-lg">{Math.round(hitRate * 100)}%</div>
              </div>
              <div className="flex gap-1">
                {filteredData.map((val, i) => {
                  const hit = isOver ? val > prop.line : val < prop.line;
                  return (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-bold"
                      style={{
                        background: hit ? `${accentColor}33` : "#ff444422",
                        color: hit ? accentColor : "#ff4444",
                      }}
                    >
                      {hit ? "✓" : "✗"}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart */}
            <div className="mb-4">
              <TrendChart data={filteredData} line={prop.line} direction={prop.direction} />
            </div>

            {/* Last results table */}
            <div>
              <div className="text-white font-semibold text-sm mb-2">
                Last {filteredData.length} Results
              </div>
              <div className="flex flex-col gap-2">
                {filteredData.map((val, i) => {
                  const hit = isOver ? val > prop.line : val < prop.line;
                  const gameNum = filteredData.length - i;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5"
                      style={{ background: "#141418", border: "1px solid #222228" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{
                            background: hit ? `${accentColor}22` : "#ff444422",
                            color: hit ? accentColor : "#ff4444",
                          }}
                        >
                          {hit ? "✓" : "✗"}
                        </div>
                        <span className="text-gray-400 text-xs">Game {gameNum}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-gray-500 text-[10px]">Result</div>
                          <div className="text-white font-bold text-sm">{val}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-500 text-[10px]">Line</div>
                          <div className="text-white text-sm">{prop.line}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-500 text-[10px]">Diff</div>
                          <div
                            className="text-sm font-medium"
                            style={{ color: hit ? accentColor : "#ff4444" }}
                          >
                            {val > prop.line ? "+" : ""}{(val - prop.line).toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Insights" && (
          <div className="flex flex-col gap-3">
            <div
              className="rounded-2xl border p-4"
              style={{ background: "#141418", borderColor: `${accentColor}33` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${accentColor}22`, color: accentColor }}
                >
                  🎯 Model Signal
                </span>
              </div>
              <div className="text-white font-semibold mb-1">
                {isOver ? "Over" : "Under"} Projection Detected
              </div>
              <div className="text-gray-400 text-xs leading-relaxed">{prop.reason}</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-gray-500 text-xs">Model Projection</div>
                  <div className="font-bold" style={{ color: accentColor }}>{prop.projection}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Line</div>
                  <div className="font-bold text-white">{prop.line}</div>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl border p-4"
              style={{ background: "#141418", borderColor: "#222228" }}
            >
              <div className="text-white font-semibold mb-3">Matchup Context</div>
              <div className="flex flex-col gap-2">
                {[
                  { label: `${prop.opponent} vs ${prop.position}`, value: "Favorable", positive: isOver },
                  { label: "Pace factor", value: "Fast (top 5)", positive: isOver },
                  { label: "Recent form", value: prop.recentForm, positive: true },
                  { label: "Home/Away split", value: `${Math.round(prop.homeAwayHitRate * 100)}% hit rate`, positive: prop.homeAwayHitRate > 0.6 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">{item.label}</span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: item.positive ? "#39ff14" : "#ff6b2b" }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Splits" && (
          <div className="flex flex-col gap-3">
            <div
              className="rounded-2xl border p-4"
              style={{ background: "#141418", borderColor: "#222228" }}
            >
              <div className="text-white font-semibold mb-3">Hit Rate Splits</div>
              {[
                { label: "Home + Away", rate: prop.homeAwayHitRate },
                { label: "Last 5", rate: prop.l5HitRate },
                { label: "Last 10", rate: prop.l10HitRate },
                { label: "Last 20", rate: prop.l20HitRate },
              ].map((split) => (
                <div key={split.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{split.label}</span>
                    <span className="text-white font-semibold">{Math.round(split.rate * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${split.rate * 100}%`, background: accentColor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Injuries" && (
          <div className="flex flex-col gap-3">
            {[
              { player: prop.playerName, status: "Active", note: "No injury designation" },
              { player: `${prop.opponent} key defender`, status: "Questionable", note: "Ankle — limited in practice" },
            ].map((item) => (
              <div
                key={item.player}
                className="rounded-2xl border p-4 flex items-center justify-between"
                style={{ background: "#141418", borderColor: "#222228" }}
              >
                <div>
                  <div className="text-white font-semibold text-sm">{item.player}</div>
                  <div className="text-gray-500 text-xs">{item.note}</div>
                </div>
                <div
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: item.status === "Active" ? "#39ff1422" : "#ff6b2b22",
                    color: item.status === "Active" ? "#39ff14" : "#ff6b2b",
                  }}
                >
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Queue (like betslip) */}
      <div
        className="fixed bottom-16 left-0 right-0 px-4 pb-2"
        style={{ zIndex: 40 }}
      >
        <div
          className="rounded-2xl border p-3 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, #1a2a1a, #0d1a0d)",
            borderColor: accentColor + "44",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
              style={{ background: `${accentColor}22`, color: accentColor }}
            >
              ✓
            </div>
            <div>
              <div className="text-white text-xs font-semibold">
                {isOver ? "Over" : "Under"} {prop.line} {prop.propType}
              </div>
              <div className="text-gray-500 text-[10px]">{prop.playerName} · Saved to queue</div>
            </div>
          </div>
          <button
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: accentColor, color: "#000" }}
          >
            View Queue
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
