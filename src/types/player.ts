export interface Player {
  id: string;
  username: string;
  skillRating: number;
  region: string;
  latency: number;
  preferences: MatchPreferences;
  status: PlayerStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchPreferences {
  gameMode: string;
  maxLatency: number;
  skillRange: {
    min: number;
    max: number;
  };
  regions: string[];
}

export enum PlayerStatus {
  ONLINE = 'online',
  IN_QUEUE = 'in_queue',
  IN_MATCH = 'in_match',
  OFFLINE = 'offline'
}

export interface PlayerStats {
  playerId: string;
  wins: number;
  losses: number;
  draws: number;
  averageLatency: number;
  skillHistory: SkillRatingEntry[];
}

export interface SkillRatingEntry {
  rating: number;
  timestamp: Date;
  matchId?: string;
}
