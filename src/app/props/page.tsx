"use client";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import FilterChips from "@/components/FilterChips";
import PropInsightCard from "@/components/PropInsightCard";
import type { PropInsight } from "@/lib/mockData";

const PROP_FILTERS = ["All", "High Conf", "Over", "Under", "Points", "Rebounds", "Assists"];

export default function PropsPage() {
  const [filter, setFilter] = useState("All");
  const [allProps, setAllProps] = useState<PropInsight[] | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const loading = allProps === null;

  useEffect(() => {
    let cancelled = false;

    const loadProps = () => {
      setApiError(null);
      fetch("/api/odds/props?sport=nba")
        .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
          if (cancelled) return;
          if (!ok) {
            setApiError(data?.error ?? "Failed to load props");
            setAllProps([]);
          } else {
            setAllProps(Array.isArray(data) ? data : []);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setApiError("Network error — could not reach the server");
            setAllProps([]);
          }
        });
    };

    loadProps();
    const interval = setInterval(loadProps, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const filtered = (allProps ?? []).filter((p) => {
    if (filter === "All") return true;
    if (filter === "High Conf") return p.confidence >= 70;
    if (filter === "Over") return p.direction === "over";
    if (filter === "Under") return p.direction === "under";
    return p.propType.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ background: "#0d0d0f" }}>
      <header className="px-4 pt-12 pb-3">
        <h1 className="text-white font-bold text-xl mb-1">Prop Analytics</h1>
        <p className="text-gray-500 text-xs">Model-backed prop insights for today&apos;s games</p>
      </header>

      <div className="px-4 mb-4 overflow-x-auto scrollbar-hide">
        <FilterChips filters={PROP_FILTERS} active={filter} onChange={setFilter} />
      </div>

      <div className="px-4 flex flex-col gap-3">
        {loading ? (
          <div
            className="rounded-2xl border p-6 text-center"
            style={{ background: "#141418", borderColor: "#222228" }}
          >
            <div className="text-gray-400 text-sm">Loading props…</div>
          </div>
        ) : apiError ? (
          <div
            className="rounded-2xl border p-6 text-center"
            style={{ background: "#141418", borderColor: "#ff6b2b44" }}
          >
            <div className="text-sm font-semibold mb-1" style={{ color: "#ff6b2b" }}>Unable to load props</div>
            <div className="text-gray-500 text-xs">{apiError}</div>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((prop) => <PropInsightCard key={prop.id} prop={prop} />)
        ) : (
          <div
            className="rounded-2xl border p-6 text-center"
            style={{ background: "#141418", borderColor: "#222228" }}
          >
            <div className="text-gray-400 text-sm">No props match this filter.</div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
