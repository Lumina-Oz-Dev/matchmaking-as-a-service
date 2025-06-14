export interface Lobby {
  lobbyId: string;
  players: LobbyPlayer[];
  maxPlayers: number;
  gameMode: string;
  region: string;
  status: LobbyStatus;
  createdAt: number;
  settings: LobbySettings;
  host: string;
}

export interface LobbyPlayer {
  playerId: string;
  skillRating: number;
  latency: number;
  isReady: boolean;
  joinedAt: number;
  role?: string;
}

export enum LobbyStatus {
  WAITING = 'waiting',
  READY = 'ready',
  STARTING = 'starting',
  DISBANDED = 'disbanded'
}

export interface LobbySettings {
  skillRatingRange: SkillRange;
  maxLatency: number;
  autoStart: boolean;
  readyTimeout: number;
  gameMode: string;
  isPrivate: boolean;
  password?: string;
}

export interface LobbyJoinRequest {
  playerId: string;
  lobbyId: string;
  password?: string;
}

export interface LobbyCreateRequest {
  playerId: string;
  gameMode: string;
  region: string;
  settings: Partial<LobbySettings>;
}