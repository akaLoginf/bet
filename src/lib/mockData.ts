// Mock data for sports prop analytics

export type Sport = {
  id: string;
  label: string;
  icon: string;
};

export type Team = {
  id: string;
  name: string;
  abbreviation: string;
  primaryColor: string;
};

export type Game = {
  id: string;
  sport: string;
  homeTeam: Team;
  awayTeam: Team;
  gameTime: string;
  homeScore?: number;
  awayScore?: number;
  status: "upcoming" | "live" | "final";
  spread: string;
  moneylineHome: string;
  moneylineAway: string;
  total: string;
  modelEdgeSpread?: number;
  modelEdgeML?: number;
  modelEdgeTotal?: number;
  winChanceHome?: number;
};

export type PropInsight = {
  id: string;
  playerId: string;
  playerName: string;
  position: string;
  team: string;
  opponent: string;
  gameId: string;
  gameTime: string;
  propType: string;
  line: number;
  projection: number;
  confidence: number;
  direction: "over" | "under";
  recentForm: string;
  trend: string;
  reason: string;
  tags: string[];
  last10: number[];
  hitRate: number;
  homeAwayHitRate: number;
  l5HitRate: number;
  l10HitRate: number;
  l20HitRate: number;
};

export type Player = {
  id: string;
  name: string;
  position: string;
  team: string;
  number: number;
  imageInitials: string;
};

export const SPORTS: Sport[] = [
  { id: "nba", label: "NBA", icon: "🏀" },
  { id: "cbb", label: "CBB(M)", icon: "🏀" },
  { id: "golf", label: "GOLF", icon: "⛳" },
  { id: "wnba", label: "WNBA", icon: "🏀" },
  { id: "mlb", label: "MLB", icon: "⚾" },
  { id: "nfl", label: "NFL", icon: "🏈" },
];

export const TEAMS: Record<string, Team> = {
  okc: {
    id: "okc",
    name: "Oklahoma City Thunder",
    abbreviation: "OKC",
    primaryColor: "#007AC1",
  },
  phi: {
    id: "phi",
    name: "Philadelphia 76ers",
    abbreviation: "PHI",
    primaryColor: "#006BB6",
  },
  mia: {
    id: "mia",
    name: "Miami Heat",
    abbreviation: "MIA",
    primaryColor: "#98002E",
  },
  sas: {
    id: "sas",
    name: "San Antonio Spurs",
    abbreviation: "SAS",
    primaryColor: "#C4CED4",
  },
  lal: {
    id: "lal",
    name: "Los Angeles Lakers",
    abbreviation: "LAL",
    primaryColor: "#552583",
  },
  bos: {
    id: "bos",
    name: "Boston Celtics",
    abbreviation: "BOS",
    primaryColor: "#007A33",
  },
  gsw: {
    id: "gsw",
    name: "Golden State Warriors",
    abbreviation: "GSW",
    primaryColor: "#1D428A",
  },
  den: {
    id: "den",
    name: "Denver Nuggets",
    abbreviation: "DEN",
    primaryColor: "#0E2240",
  },
  mil: {
    id: "mil",
    name: "Milwaukee Bucks",
    abbreviation: "MIL",
    primaryColor: "#00471B",
  },
  nyk: {
    id: "nyk",
    name: "New York Knicks",
    abbreviation: "NYK",
    primaryColor: "#006BB6",
  },
};

export const GAMES: Game[] = [
  {
    id: "game-1",
    sport: "nba",
    homeTeam: TEAMS.phi,
    awayTeam: TEAMS.okc,
    gameTime: "2026-03-24T01:00:00Z",
    status: "upcoming",
    spread: "OKC -16.0",
    moneylineHome: "+731",
    moneylineAway: "-1100",
    total: "224.5",
    modelEdgeSpread: 68,
    modelEdgeML: 72,
    modelEdgeTotal: 61,
    winChanceHome: 14,
  },
  {
    id: "game-2",
    sport: "nba",
    homeTeam: TEAMS.bos,
    awayTeam: TEAMS.lal,
    gameTime: "2026-03-24T00:30:00Z",
    status: "upcoming",
    spread: "BOS -4.5",
    moneylineHome: "-185",
    moneylineAway: "+155",
    total: "217.0",
    modelEdgeSpread: 55,
    modelEdgeML: 58,
    modelEdgeTotal: 63,
    winChanceHome: 62,
  },
  {
    id: "game-3",
    sport: "nba",
    homeTeam: TEAMS.gsw,
    awayTeam: TEAMS.den,
    gameTime: "2026-03-24T02:00:00Z",
    status: "upcoming",
    spread: "DEN -2.5",
    moneylineHome: "+120",
    moneylineAway: "-142",
    total: "228.5",
    modelEdgeSpread: 51,
    modelEdgeML: 49,
    modelEdgeTotal: 71,
    winChanceHome: 45,
  },
  {
    id: "game-4",
    sport: "nba",
    homeTeam: TEAMS.mil,
    awayTeam: TEAMS.nyk,
    gameTime: "2026-03-24T00:00:00Z",
    status: "upcoming",
    spread: "NYK -3.0",
    moneylineHome: "+135",
    moneylineAway: "-158",
    total: "221.5",
    modelEdgeSpread: 59,
    modelEdgeML: 62,
    modelEdgeTotal: 55,
    winChanceHome: 42,
  },
];

export const PLAYERS: Record<string, Player> = {
  "wemby-1": {
    id: "wemby-1",
    name: "Victor Wembanyama",
    position: "C",
    team: "SAS",
    number: 1,
    imageInitials: "VW",
  },
  "embiid-1": {
    id: "embiid-1",
    name: "Joel Embiid",
    position: "C",
    team: "PHI",
    number: 11,
    imageInitials: "JE",
  },
  "sga-1": {
    id: "sga-1",
    name: "Shai Gilgeous-Alexander",
    position: "PG",
    team: "OKC",
    number: 2,
    imageInitials: "SG",
  },
  "tatum-1": {
    id: "tatum-1",
    name: "Jayson Tatum",
    position: "SF",
    team: "BOS",
    number: 0,
    imageInitials: "JT",
  },
  "jokic-1": {
    id: "jokic-1",
    name: "Nikola Jokić",
    position: "C",
    team: "DEN",
    number: 15,
    imageInitials: "NJ",
  },
};

export const PROP_INSIGHTS: PropInsight[] = [
  {
    id: "prop-1",
    playerId: "wemby-1",
    playerName: "Victor Wembanyama",
    position: "C",
    team: "SAS",
    opponent: "MIA",
    gameId: "game-heat-spurs",
    gameTime: "2026-03-24T01:00:00Z",
    propType: "Rebounds",
    line: 12.5,
    projection: 9.2,
    confidence: 68,
    direction: "under",
    recentForm: "8/10",
    trend: "under",
    reason: "Opponent allows low rebound volume to centers",
    tags: ["high confidence", "strong matchup"],
    last10: [8, 11, 7, 9, 10, 8, 6, 9, 12, 7],
    hitRate: 0.7,
    homeAwayHitRate: 0.68,
    l5HitRate: 0.8,
    l10HitRate: 0.7,
    l20HitRate: 0.65,
  },
  {
    id: "prop-2",
    playerId: "sga-1",
    playerName: "Shai Gilgeous-Alexander",
    position: "PG",
    team: "OKC",
    opponent: "PHI",
    gameId: "game-1",
    gameTime: "2026-03-24T01:00:00Z",
    propType: "Points",
    line: 32.5,
    projection: 36.1,
    confidence: 74,
    direction: "over",
    recentForm: "7/10",
    trend: "over",
    reason: "PHI allows 2nd-most points to PGs this season",
    tags: ["model edge", "trending over"],
    last10: [35, 38, 29, 41, 33, 37, 40, 28, 36, 39],
    hitRate: 0.72,
    homeAwayHitRate: 0.75,
    l5HitRate: 0.8,
    l10HitRate: 0.7,
    l20HitRate: 0.68,
  },
  {
    id: "prop-3",
    playerId: "tatum-1",
    playerName: "Jayson Tatum",
    position: "SF",
    team: "BOS",
    opponent: "LAL",
    gameId: "game-2",
    gameTime: "2026-03-24T00:30:00Z",
    propType: "Points + Assists",
    line: 34.5,
    projection: 37.8,
    confidence: 65,
    direction: "over",
    recentForm: "6/10",
    trend: "over",
    reason: "LAL defense ranks 25th vs combo guards/forwards",
    tags: ["value projection"],
    last10: [38, 31, 42, 29, 37, 35, 40, 28, 34, 36],
    hitRate: 0.65,
    homeAwayHitRate: 0.7,
    l5HitRate: 0.6,
    l10HitRate: 0.65,
    l20HitRate: 0.62,
  },
  {
    id: "prop-4",
    playerId: "jokic-1",
    playerName: "Nikola Jokić",
    position: "C",
    team: "DEN",
    opponent: "GSW",
    gameId: "game-3",
    gameTime: "2026-03-24T02:00:00Z",
    propType: "Assists",
    line: 8.5,
    projection: 10.3,
    confidence: 71,
    direction: "over",
    recentForm: "7/10",
    trend: "over",
    reason: "Warriors allow high assist opportunities to opposing centers",
    tags: ["high confidence", "model edge"],
    last10: [9, 11, 8, 12, 10, 9, 13, 7, 11, 10],
    hitRate: 0.68,
    homeAwayHitRate: 0.65,
    l5HitRate: 0.7,
    l10HitRate: 0.68,
    l20HitRate: 0.66,
  },
];

export const TOP_MODELS = [
  {
    id: "model-1",
    name: "Sharp Line Model",
    description: "Detects market inefficiencies in opening lines",
    accuracy: "68.4%",
    sport: "NBA",
    badge: "🔥",
  },
  {
    id: "model-2",
    name: "Player Prop Projector",
    description: "Stat-based projections with matchup weighting",
    accuracy: "71.2%",
    sport: "NBA",
    badge: "⚡",
  },
  {
    id: "model-3",
    name: "Total Trend Tracker",
    description: "Identifies pace and total trends",
    accuracy: "65.8%",
    sport: "NBA",
    badge: "📊",
  },
];

export function formatGameTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatGameDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });
}
