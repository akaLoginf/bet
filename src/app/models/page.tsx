import BottomNav from "@/components/BottomNav";
import { TOP_MODELS } from "@/lib/mockData";

const MODEL_DETAILS = [
  { id: "model-1", winRate: "68.4%", totalPicks: 312, streak: 5, sports: ["NBA", "NFL"] },
  { id: "model-2", winRate: "71.2%", totalPicks: 445, streak: 8, sports: ["NBA"] },
  { id: "model-3", winRate: "65.8%", totalPicks: 289, streak: 3, sports: ["NBA", "MLB"] },
];

export default function ModelsPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ background: "#0d0d0f" }}>
      <header className="px-4 pt-12 pb-3">
        <h1 className="text-white font-bold text-xl mb-1">Analytics Models</h1>
        <p className="text-gray-500 text-xs">Projection and insight engines powering PropPulse</p>
      </header>

      <div className="px-4 flex flex-col gap-4">
        {TOP_MODELS.map((model) => {
          const details = MODEL_DETAILS.find((d) => d.id === model.id) || MODEL_DETAILS[0];
          return (
            <div
              key={model.id}
              className="rounded-2xl border p-4"
              style={{ background: "#141418", borderColor: "#222228" }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: "#1e1e24" }}
                >
                  {model.badge}
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-base">{model.name}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{model.description}</div>
                  <div className="flex gap-1.5 mt-2">
                    {details.sports.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800">
                <div className="text-center">
                  <div className="text-gray-500 text-[10px] mb-0.5">Win Rate</div>
                  <div className="font-bold text-sm" style={{ color: "#39ff14" }}>{details.winRate}</div>
                </div>
                <div className="text-center border-x border-gray-800">
                  <div className="text-gray-500 text-[10px] mb-0.5">Total Picks</div>
                  <div className="text-white font-bold text-sm">{details.totalPicks}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-[10px] mb-0.5">Current Streak</div>
                  <div className="font-bold text-sm" style={{ color: "#ff6b2b" }}>+{details.streak}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
