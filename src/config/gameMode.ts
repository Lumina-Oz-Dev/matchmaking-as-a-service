export interface GameModeConfig {
  name: string;
  displayName: string;
  maxPlayers: number;
  minPlayers: number;
  skillBalancingEnabled: boolean;
  latencyThreshold: number;
  estimatedMatchDuration: number;
  rankingEnabled: boolean;
}

export const GAME_MODES: Record<string, GameModeConfig> = {
  DUEL: {
    name: 'duel',
    displayName: '1v1 Duel',
    maxPlayers: 2,
    minPlayers: 2,
    skillBalancingEnabled: true,
    latencyThreshold: 100,
    estimatedMatchDuration: 600000, // 10 minutes
    rankingEnabled: true
  },
  
  TEAM_MATCH: {
    name: 'team_match',
    displayName: '2v2 Team Match',
    maxPlayers: 4,
    minPlayers: 4,
    skillBalancingEnabled: true,
    latencyThreshold: 120,
    estimatedMatchDuration: 900000, // 15 minutes
    rankingEnabled: true
  },
  
  SQUAD_BATTLE: {
    name: 'squad_battle',
    displayName: '4v4 Squad Battle',
    maxPlayers: 8,
    minPlayers: 8,
    skillBalancingEnabled: true,
    latencyThreshold: 150,
    estimatedMatchDuration: 1200000, // 20 minutes
    rankingEnabled: true
  },
  
  CASUAL: {
    name: 'casual',
    displayName: 'Casual Match',
    maxPlayers: 6,
    minPlayers: 2,
    skillBalancingEnabled: false,
    latencyThreshold: 200,
    estimatedMatchDuration: 480000, // 8 minutes
    rankingEnabled: false
  },
  
  RANKED: {
    name: 'ranked',
    displayName: 'Ranked Match',
    maxPlayers: 2,
    minPlayers: 2,
    skillBalancingEnabled: true,
    latencyThreshold: 80,
    estimatedMatchDuration: 1800000, // 30 minutes
    rankingEnabled: true
  }
};

export function getGameModeConfig(gameMode: string): GameModeConfig | null {
  return GAME_MODES[gameMode.toUpperCase()] || null;
}

export function isValidGameMode(gameMode: string): boolean {
  return gameMode.toUpperCase() in GAME_MODES;
}

export function getAvailableGameModes(): string[] {
  return Object.keys(GAME_MODES);
}