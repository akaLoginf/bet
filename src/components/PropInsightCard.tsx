import Link from "next/link";
import { PropInsight } from "@/lib/mockData";

interface PropInsightCardProps {
  prop: PropInsight;
}

export default function PropInsightCard({ prop }: PropInsightCardProps) {
  const isOver = prop.direction === "over";
  const accentColor = isOver ? "#39ff14" : "#ff6b2b";

  return (
    <Link href={`/props/${prop.id}`}>
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 cursor-pointer hover:border-gray-600 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Player avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #2a2a4a, #1a3a5c)" }}
            >
              {prop.playerName.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{prop.playerName}</div>
              <div className="text-gray-500 text-xs">
                {prop.position} · {prop.team} vs {prop.opponent}
              </div>
            </div>
          </div>

          {/* Confidence badge */}
          <div
            className="flex flex-col items-end gap-0.5"
          >
            <div
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: `${accentColor}22`,
                color: accentColor,
                border: `1px solid ${accentColor}44`,
              }}
            >
              {prop.confidence}% conf
            </div>
          </div>
        </div>

        {/* Prop line */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-gray-500 text-xs mb-0.5">{prop.propType}</div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-lg font-bold"
                style={{ color: accentColor }}
              >
                {isOver ? "Over" : "Under"} {prop.line}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 text-xs mb-0.5">Projection</div>
            <div className="text-white font-semibold">{prop.projection}</div>
          </div>
        </div>

        {/* Mini trend */}
        <div className="flex gap-1 mb-3">
          {prop.last10.slice(-5).map((val, i) => {
            const hit = isOver ? val > prop.line : val < prop.line;
            return (
              <div
                key={i}
                className="flex-1 rounded text-center text-[9px] font-bold py-0.5"
                style={{
                  background: hit ? `${accentColor}22` : "#ff444422",
                  color: hit ? accentColor : "#ff4444",
                }}
              >
                {val}
              </div>
            );
          })}
        </div>

        {/* Tags and hit rate */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {prop.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-[10px] text-gray-500">
            L10: <span className="text-white font-medium">{Math.round(prop.l10HitRate * 100)}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
