import Link from "next/link";
import { Game, formatGameTime } from "@/lib/mockData";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const { homeTeam, awayTeam, gameTime, spread, moneylineHome, total, winChanceHome } = game;

  return (
    <Link href={`/games/${game.id}`}>
      <div className="flex-shrink-0 w-72 rounded-2xl border border-gray-800 bg-gray-900 p-4 cursor-pointer hover:border-gray-600 transition-colors">
        {/* Teams */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: awayTeam.primaryColor }}
            >
              {awayTeam.abbreviation}
            </div>
            <span className="text-xs text-gray-400">{awayTeam.abbreviation}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">{formatGameTime(gameTime)}</span>
            <span className="text-white font-bold text-sm">VS</span>
            {game.status === "live" && (
              <span className="mt-1 text-[10px] text-red-400 font-semibold animate-pulse">LIVE</span>
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: homeTeam.primaryColor }}
            >
              {homeTeam.abbreviation}
            </div>
            <span className="text-xs text-gray-400">{homeTeam.abbreviation}</span>
          </div>
        </div>

        {/* Win chance bar */}
        {winChanceHome !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>{awayTeam.abbreviation} {100 - winChanceHome}%</span>
              <span>{homeTeam.abbreviation} {winChanceHome}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${100 - winChanceHome}%`,
                  background: "linear-gradient(90deg, #39ff14, #00cc44)",
                }}
              />
            </div>
          </div>
        )}

        {/* Lines */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800">
          <div className="text-center">
            <div className="text-[10px] text-gray-500 mb-0.5">Spread</div>
            <div className="text-xs text-white font-medium">{spread}</div>
          </div>
          <div className="text-center border-x border-gray-800">
            <div className="text-[10px] text-gray-500 mb-0.5">ML</div>
            <div className="text-xs text-white font-medium">{moneylineHome}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-500 mb-0.5">Total</div>
            <div className="text-xs text-white font-medium">{total}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
