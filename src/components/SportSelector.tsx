"use client";
import { SPORTS } from "@/lib/mockData";

interface SportSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

export default function SportSelector({ selected, onChange }: SportSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
      {SPORTS.map((sport) => {
        const active = selected === sport.id;
        return (
          <button
            key={sport.id}
            onClick={() => onChange(sport.id)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{
              background: active ? "#39ff14" : "transparent",
              color: active ? "#000" : "#aaa",
              borderColor: active ? "#39ff14" : "#333",
            }}
          >
            {sport.label}
          </button>
        );
      })}
    </div>
  );
}
