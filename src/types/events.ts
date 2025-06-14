export interface GameEvent {
  eventId: string;
  eventType: EventType;
  playerId?: string;
  matchId?: string;
  lobbyId?: string;
  timestamp: number;
  data: any;
}

export enum EventType {
  PLAYER_JOINED_QUEUE = 'player_joined_queue',
  PLAYER_LEFT_QUEUE = 'player_left_queue',
  MATCH_FOUND = 'match_found',
  MATCH_STARTED = 'match_started',
  MATCH_ENDED = 'match_ended',
  PLAYER_READY = 'player_ready',
  PLAYER_NOT_READY = 'player_not_ready',
  LOBBY_CREATED = 'lobby_created',
  LOBBY_DISBANDED = 'lobby_disbanded',
  SKILL_RATING_UPDATED = 'skill_rating_updated',
  SERVER_ALLOCATED = 'server_allocated',
  SERVER_DEALLOCATED = 'server_deallocated'
}

export interface PlayerJoinedQueueEvent {
  playerId: string;
  gameMode: string;
  region: string;
  skillRating: number;
  estimatedWaitTime: number;
}

export interface MatchFoundEvent {
  matchId: string;
  players: string[];
  gameMode: string;
  region: string;
  serverDetails: ServerDetails;
}

export interface SkillRatingUpdateEvent {
  playerId: string;
  oldRating: number;
  newRating: number;
  change: number;
  matchId: string;
}