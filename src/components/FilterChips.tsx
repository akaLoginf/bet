interface FilterChipsProps {
  filters: string[];
  active: string;
  onChange: (f: string) => void;
  accentColor?: string;
}

export default function FilterChips({
  filters,
  active,
  onChange,
  accentColor = "#39ff14",
}: FilterChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((f) => {
        const isActive = f === active;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{
              background: isActive ? `${accentColor}22` : "transparent",
              color: isActive ? accentColor : "#666",
              borderColor: isActive ? accentColor : "#333",
            }}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}
