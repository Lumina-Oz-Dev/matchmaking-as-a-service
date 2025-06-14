export interface Match {
  id: string;
  gameMode: string;
  players: string[]; // Player IDs
  status: MatchStatus;
  region: string;
  averageSkillRating: number;
  maxLatency: number;
  lobbyId?: string;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  result?: MatchResult;
}

export enum MatchStatus {
  PENDING = 'pending',
  STARTING = 'starting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface MatchResult {
  winners: string[]; // Player IDs
  losers: string[]; // Player IDs
  draws?: string[]; // Player IDs for draw scenarios
  duration: number; // in seconds
  skillChanges: SkillChange[];
}

export interface SkillChange {
  playerId: string;
  oldRating: number;
  newRating: number;
  change: number;
}

export interface MatchmakingRequest {
  playerId: string;
  gameMode: string;
  region: string;
  timestamp: Date;
  priority: number;
}
