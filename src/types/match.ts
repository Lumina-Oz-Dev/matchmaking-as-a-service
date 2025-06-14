export interface Match {
  matchId: string;
  players: string[];
  gameMode: string;
  region: string;
  skillRatingRange: SkillRange;
  averageLatency: number;
  status: MatchStatus;
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  serverDetails?: ServerDetails;
}

export interface SkillRange {
  min: number;
  max: number;
  average: number;
}

export enum MatchStatus {
  PENDING = 'pending',
  STARTING = 'starting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  CANCELLED = 'cancelled'
}

export interface ServerDetails {
  serverId: string;
  serverIp: string;
  serverPort: number;
  region: string;
  gameVersion: string;
}

export interface MatchmakingRequest {
  playerId: string;
  gameMode: string;
  region?: string;
  maxWaitTime?: number;
  skillRatingOverride?: number;
}

export interface MatchmakingResponse {
  success: boolean;
  matchId?: string;
  estimatedWaitTime?: number;
  queuePosition?: number;
  error?: string;
}