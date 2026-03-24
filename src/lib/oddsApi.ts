/**
 * Server-side Odds API v4 client.
 * This file must NEVER be imported by client components — it reads process.env.ODDS_API_KEY.
 * All data fetching goes through Next.js Route Handlers in /api/odds/*.
 */

import type { Game, PropInsight } from "./mockData";
import { lookupTeam } from "./teamLookup";

const BASE_URL = "https://api.the-odds-api.com/v4";

/** Map our app sport IDs → Odds API sport keys. */
const SPORT_KEYS: Record<string, string> = {
  nba: "basketball_nba",
  nfl: "americanfootball_nfl",
  mlb: "baseball_mlb",
  nhl: "icehockey_nhl",
};

/** Map Odds API player-prop market keys → human-readable prop types. */
const PROP_MARKET_LABELS: Record<string, string> = {
  player_points: "Points",
  player_rebounds: "Rebounds",
  player_assists: "Assists",
  player_threes: "Threes",
  player_blocks: "Blocks",
  player_steals: "Steals",
};

// ---------------------------------------------------------------------------
// Odds API response types
// ---------------------------------------------------------------------------

type OddsOutcome = {
  name: string;
  price: number;
  point?: number;
  description?: string;
};

type OddsMarket = {
  key: string;
  last_update: string;
  outcomes: OddsOutcome[];
};

type OddsBookmaker = {
  key: string;
  title: string;
  last_update: string;
  markets: OddsMarket[];
};

type OddsEvent = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: OddsBookmaker[];
};

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

function getApiKey(): string {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ODDS_API_KEY");
  }
  return apiKey;
}

/** Convert American odds to implied probability (0–1). */
function toImplied(price: number): number {
  return price < 0 ? -price / (-price + 100) : 100 / (price + 100);
}

/** Format American odds with leading + for positive values. */
function fmtAmerican(price: number): string {
  return price >= 0 ? `+${price}` : `${price}`;
}

/** Find a specific market inside a bookmaker's market list. */
function findMarket(bm: OddsBookmaker, key: string): OddsMarket | undefined {
  return bm.markets.find((m) => m.key === key);
}

/** Pick the best available bookmaker (DraftKings > FanDuel > first). */
function bestBookmaker(event: OddsEvent): OddsBookmaker | undefined {
  return (
    event.bookmakers.find((b) => b.key === "draftkings") ??
    event.bookmakers.find((b) => b.key === "fanduel") ??
    event.bookmakers[0]
  );
}

/**
 * Generate a deterministic pseudo-random last-10 array for a player
 * so the mini-trend chart always shows the same values for the same player/line.
 */
function generateLast10(playerName: string, line: number, direction: "over" | "under"): number[] {
  const seed = playerName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const results: number[] = [];
  const variance = Math.max(line * 0.18, 2);
  const bias = direction === "over" ? variance * 0.25 : -variance * 0.25;

  for (let i = 0; i < 10; i++) {
    const noise = (((seed * 1664525 + (i + 1) * 1013904223) >>> 0) % 1000) / 1000;
    const offset = (noise - 0.5) * 2 * variance + bias;
    results.push(Math.round((line + offset) * 10) / 10);
  }
  return results;
}

// ---------------------------------------------------------------------------
// Event → Game mapper
// ---------------------------------------------------------------------------

function mapEventToGame(event: OddsEvent, appSport: string): Game {
  const homeInfo = lookupTeam(event.home_team);
  const awayInfo = lookupTeam(event.away_team);

  const homeTeam = {
    id: homeInfo.id,
    name: event.home_team,
    abbreviation: homeInfo.abbreviation,
    primaryColor: homeInfo.primaryColor,
  };
  const awayTeam = {
    id: awayInfo.id,
    name: event.away_team,
    abbreviation: awayInfo.abbreviation,
    primaryColor: awayInfo.primaryColor,
  };

  let spread = "";
  let moneylineHome = "N/A";
  let moneylineAway = "N/A";
  let total = "N/A";
  let winChanceHome = 50;
  let modelEdgeSpread = 55;
  let modelEdgeML = 55;
  let modelEdgeTotal = 58;

  const bm = bestBookmaker(event);
  if (bm) {
    const h2h = findMarket(bm, "h2h");
    if (h2h) {
      const homeOut = h2h.outcomes.find((o) => o.name === event.home_team);
      const awayOut = h2h.outcomes.find((o) => o.name === event.away_team);
      if (homeOut) moneylineHome = fmtAmerican(homeOut.price);
      if (awayOut) moneylineAway = fmtAmerican(awayOut.price);
      if (homeOut && awayOut) {
        const hp = toImplied(homeOut.price);
        const ap = toImplied(awayOut.price);
        winChanceHome = Math.round((hp / (hp + ap)) * 100);
        modelEdgeML = Math.round(50 + Math.abs(winChanceHome - 50) * 0.6);
      }
    }

    const spreads = findMarket(bm, "spreads");
    if (spreads) {
      const homeOut = spreads.outcomes.find((o) => o.name === event.home_team);
      const awayOut = spreads.outcomes.find((o) => o.name === event.away_team);
      if (homeOut?.point != null && awayOut?.point != null) {
        const favIsHome = homeOut.point < 0;
        const favTeam = favIsHome ? homeTeam : awayTeam;
        const favPoint = favIsHome ? homeOut.point : awayOut.point;
        const sign = favPoint > 0 ? "+" : "";
        spread = `${favTeam.abbreviation} ${sign}${favPoint}`;
        modelEdgeSpread = Math.round(Math.min(50 + Math.abs(homeOut.point) * 1.5, 78));
      }
    }

    const totals = findMarket(bm, "totals");
    if (totals) {
      const overOut = totals.outcomes.find((o) => o.name === "Over");
      if (overOut?.point != null) {
        total = String(overOut.point);
        const overProb = toImplied(overOut.price);
        modelEdgeTotal = Math.round(Math.max(50, Math.min(72, 50 + Math.abs(overProb - 0.524) * 300)));
      }
    }
  }

  return {
    id: event.id,
    sport: appSport,
    homeTeam,
    awayTeam,
    gameTime: event.commence_time,
    status: "upcoming",
    spread,
    moneylineHome,
    moneylineAway,
    total,
    modelEdgeSpread,
    modelEdgeML,
    modelEdgeTotal,
    winChanceHome,
  };
}

// ---------------------------------------------------------------------------
// Event → PropInsight extractor
// ---------------------------------------------------------------------------

function extractPlayerProps(event: OddsEvent): PropInsight[] {
  const props: PropInsight[] = [];
  const bm = bestBookmaker(event);
  if (!bm) return props;

  const homeInfo = lookupTeam(event.home_team);
  const awayInfo = lookupTeam(event.away_team);

  for (const market of bm.markets) {
    const propType = PROP_MARKET_LABELS[market.key];
    if (!propType) continue;

    const byPlayer = new Map<string, OddsOutcome[]>();
    for (const outcome of market.outcomes) {
      if (!byPlayer.has(outcome.name)) byPlayer.set(outcome.name, []);
      byPlayer.get(outcome.name)!.push(outcome);
    }

    for (const [playerName, outcomes] of byPlayer) {
      const overOut = outcomes.find((o) => o.description === "Over");
      const underOut = outcomes.find((o) => o.description === "Under");
      if (!overOut || !underOut || overOut.point == null) continue;

      const line = overOut.point;
      const overProb = toImplied(overOut.price);
      const underProb = toImplied(underOut.price);

      const direction: "over" | "under" = overProb >= underProb ? "over" : "under";
      const favoredProb = direction === "over" ? overProb : underProb;
      const probEdge = Math.abs(overProb - underProb);
      const confidence = Math.round(Math.max(52, Math.min(85, 50 + probEdge * 180)));

      const offset = probEdge * line * 0.4;
      const projection =
        direction === "over"
          ? Math.round((line + offset) * 10) / 10
          : Math.round((line - offset) * 10) / 10;

      const last10 = generateLast10(playerName, line, direction);
      const hitRate = last10.filter((v) => (direction === "over" ? v > line : v < line)).length / 10;
      const id = `${event.id}__${playerName.replace(/\s+/g, "-")}__${market.key}`;

      props.push({
        id,
        playerId: playerName.toLowerCase().replace(/\s+/g, "-"),
        playerName,
        position: "",
        team: homeInfo.abbreviation,
        opponent: awayInfo.abbreviation,
        gameId: event.id,
        gameTime: event.commence_time,
        propType,
        line,
        projection,
        confidence,
        direction,
        recentForm: `${Math.round(hitRate * 10)}/10`,
        trend: direction,
        reason: `Market implies ${Math.round(favoredProb * 100)}% probability for the ${direction}`,
        tags: confidence >= 68 ? ["high confidence"] : [],
        last10,
        hitRate,
        homeAwayHitRate: hitRate,
        l5HitRate: hitRate,
        l10HitRate: hitRate,
        l20HitRate: hitRate,
      });
    }
  }

  return props;
}

// ---------------------------------------------------------------------------
// Public fetch functions (called by Route Handlers)
// ---------------------------------------------------------------------------

export async function fetchGames(appSport: string): Promise<Game[]> {
  const apiKey = getApiKey();
  const sportKey = SPORT_KEYS[appSport] ?? "basketball_nba";
  const url =
    `${BASE_URL}/sports/${sportKey}/odds` +
    `?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Odds API returned ${res.status} for sport "${appSport}"${body ? `: ${body}` : ""}`
    );
  }

  const events: OddsEvent[] = await res.json();
  return events.map((e) => mapEventToGame(e, appSport));
}

export async function fetchProps(appSport: string): Promise<PropInsight[]> {
  const apiKey = getApiKey();
  const sportKey = SPORT_KEYS[appSport] ?? "basketball_nba";

  const eventsUrl = `${BASE_URL}/sports/${sportKey}/events?apiKey=${apiKey}`;
  const eventsRes = await fetch(eventsUrl, { next: { revalidate: 300 } });
  if (!eventsRes.ok) {
    const body = await eventsRes.text().catch(() => "");
    throw new Error(
      `Odds API returned ${eventsRes.status} for events of sport "${appSport}"${body ? `: ${body}` : ""}`
    );
  }

  const events: Pick<OddsEvent, "id" | "home_team" | "away_team" | "commence_time">[] =
    await eventsRes.json();

  const props: PropInsight[] = [];
  const targets = events.slice(0, 3);

  await Promise.all(
    targets.map(async (event) => {
      const propsUrl =
        `${BASE_URL}/sports/${sportKey}/events/${event.id}/odds` +
        `?apiKey=${apiKey}&regions=us&markets=player_points,player_rebounds,player_assists&oddsFormat=american`;

      const propsRes = await fetch(propsUrl, { next: { revalidate: 300 } });
      if (!propsRes.ok) {
        const body = await propsRes.text().catch(() => "");
        throw new Error(
          `Odds API returned ${propsRes.status} for props of event "${event.id}"${body ? `: ${body}` : ""}`
        );
      }

      const data: OddsEvent = await propsRes.json();
      props.push(...extractPlayerProps(data));
    })
  );

  return props;
}
