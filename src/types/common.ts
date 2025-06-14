export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface LatencyInfo {
  region: string;
  latency: number;
  timestamp: Date;
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  averageMatchDuration: number; // in seconds
  skillVarianceThreshold: number;
  latencyThreshold: number;
  enabled: boolean;
}

export interface Region {
  id: string;
  name: string;
  endpoint: string;
  enabled: boolean;
  priority: number;
}

export enum ErrorCode {
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND',
  PLAYER_ALREADY_IN_QUEUE = 'PLAYER_ALREADY_IN_QUEUE',
  MATCH_NOT_FOUND = 'MATCH_NOT_FOUND',
  LOBBY_NOT_FOUND = 'LOBBY_NOT_FOUND',
  LOBBY_FULL = 'LOBBY_FULL',
  INVALID_SKILL_RANGE = 'INVALID_SKILL_RANGE',
  HIGH_LATENCY = 'HIGH_LATENCY',
  REGION_NOT_SUPPORTED = 'REGION_NOT_SUPPORTED',
  GAME_MODE_NOT_FOUND = 'GAME_MODE_NOT_FOUND',
  INSUFFICIENT_PLAYERS = 'INSUFFICIENT_PLAYERS',
  SYSTEM_ERROR = 'SYSTEM_ERROR'
}
