export interface MatchmakingQueue {
  queueId: string;
  gameMode: string;
  region: string;
  players: QueuedPlayer[];
  createdAt: number;
  lastProcessed: number;
  settings: QueueSettings;
}

export interface QueuedPlayer {
  playerId: string;
  skillRating: number;
  latency: number;
  queueTime: number;
  preferences: PlayerPreferences;
  priority: number;
  region: string;
}

export interface QueueSettings {
  maxPlayers: number;
  skillRangeExpansion: number;
  latencyTolerance: number;
  maxWaitTime: number;
  balancingWeight: BalancingWeights;
}

export interface BalancingWeights {
  skillRating: number;
  latency: number;
  waitTime: number;
  region: number;
}

export interface QueueMetrics {
  totalPlayers: number;
  averageWaitTime: number;
  matchesPerMinute: number;
  averageSkillRange: number;
  regionDistribution: Record<string, number>;
}