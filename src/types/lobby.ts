export interface Lobby {
  id: string;
  matchId: string;
  players: LobbyPlayer[];
  status: LobbyStatus;
  gameMode: string;
  region: string;
  serverEndpoint?: string;
  createdAt: Date;
  expiresAt: Date;
  settings: LobbySettings;
}

export interface LobbyPlayer {
  playerId: string;
  username: string;
  skillRating: number;
  latency: number;
  joinedAt: Date;
  ready: boolean;
}

export enum LobbyStatus {
  WAITING = 'waiting',
  READY = 'ready',
  STARTING = 'starting',
  ACTIVE = 'active',
  EXPIRED = 'expired'
}

export interface LobbySettings {
  maxPlayers: number;
  readyTimeoutSeconds: number;
  allowSpectators: boolean;
  gameConfiguration: Record<string, any>;
}
