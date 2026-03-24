import BottomNav from "@/components/BottomNav";

const ARTICLES = [
  {
    id: 1,
    title: "How Pace Affects Total Projections",
    category: "Analytics Deep Dive",
    readTime: "5 min",
    description: "Explore how team pace metrics directly influence our total line projections and confidence scores.",
    date: "Mar 23, 2026",
  },
  {
    id: 2,
    title: "Understanding Model Edge in Player Props",
    category: "Model Explainer",
    readTime: "4 min",
    description: "A breakdown of how our player prop models weight recent form, matchup data, and historical trends.",
    date: "Mar 22, 2026",
  },
  {
    id: 3,
    title: "NBA March Matchup Trends",
    category: "Trend Report",
    readTime: "7 min",
    description: "Late-season fatigue, lineup changes, and playoff implications all affect prop performance data.",
    date: "Mar 21, 2026",
  },
  {
    id: 4,
    title: "Top 5 Rebounders vs Zone Defenses",
    category: "Matchup Analysis",
    readTime: "3 min",
    description: "Centers and power forwards face unique rebounding conditions against zone coverage schemes.",
    date: "Mar 20, 2026",
  },
];

export default function ResearchPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ background: "#0d0d0f" }}>
      <header className="px-4 pt-12 pb-3">
        <h1 className="text-white font-bold text-xl mb-1">Research</h1>
        <p className="text-gray-500 text-xs">Analytics deep dives, model explainers, and trend reports</p>
      </header>

      <div className="px-4 flex flex-col gap-3">
        {ARTICLES.map((article) => (
          <div
            key={article.id}
            className="rounded-2xl border p-4 cursor-pointer hover:border-gray-600 transition-colors"
            style={{ background: "#141418", borderColor: "#222228" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                {article.category}
              </span>
              <span className="text-[10px] text-gray-600">{article.readTime} read</span>
            </div>
            <div className="text-white font-semibold text-sm mb-1">{article.title}</div>
            <div className="text-gray-500 text-xs leading-relaxed mb-2">{article.description}</div>
            <div className="text-gray-600 text-[10px]">{article.date}</div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
