interface TabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-gray-800">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className="flex-1 py-2.5 text-xs font-semibold transition-colors relative"
            style={{ color: isActive ? "#39ff14" : "#666" }}
          >
            {tab}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: "#39ff14" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
