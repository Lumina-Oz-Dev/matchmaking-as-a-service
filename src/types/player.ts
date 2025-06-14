export interface Player {
  playerId: string;
  skillRating: number;
  latency: number;
  region: string;
  queueTime: number;
  preferences: PlayerPreferences;
  matchHistory: MatchResult[];
  status: PlayerStatus;
  gameMode: string;
}

export interface PlayerPreferences {
  maxLatency: number;
  skillRangeTolerance: number;
  preferredRegions: string[];
  gameMode: string;
}

export interface MatchResult {
  matchId: string;
  result: 'win' | 'loss' | 'draw';
  skillRatingChange: number;
  timestamp: number;
  opponents: string[];
}

export enum PlayerStatus {
  ONLINE = 'online',
  IN_QUEUE = 'in_queue',
  IN_MATCH = 'in_match',
  OFFLINE = 'offline'
}

export interface PlayerStats {
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  averageLatency: number;
  currentStreak: number;
  maxStreak: number;
}