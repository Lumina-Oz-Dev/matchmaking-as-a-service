export const MATCHMAKING_CONFIG = {
  // Skill rating configuration
  SKILL_RATING: {
    DEFAULT_RATING: 1000,
    MIN_RATING: 0,
    MAX_RATING: 3000,
    K_FACTOR: 32, // ELO K-factor
    PLACEMENT_MATCHES: 10,
    MAX_SKILL_DIFFERENCE: 300
  },
  
  // Latency configuration
  LATENCY: {
    MAX_ACCEPTABLE: 150, // milliseconds
    PREFERRED_MAX: 80,
    WEIGHT_FACTOR: 0.3
  },
  
  // Queue configuration
  QUEUE: {
    MAX_WAIT_TIME: 300, // 5 minutes in seconds
    SEARCH_EXPANSION_INTERVAL: 30, // seconds
    SKILL_EXPANSION_RATE: 50, // rating points per expansion
    LATENCY_EXPANSION_RATE: 20, // ms per expansion
    MAX_EXPANSIONS: 5
  },
  
  // Match configuration
  MATCH: {
    READY_TIMEOUT: 30, // seconds
    LOBBY_EXPIRY: 600, // 10 minutes
    MIN_PLAYERS_1V1: 2,
    MIN_PLAYERS_TEAM: 4,
    MAX_PLAYERS_TEAM: 10
  },
  
  // Regional preferences
  REGIONS: {
    'us-east-1': { name: 'US East', priority: 1 },
    'us-west-2': { name: 'US West', priority: 2 },
    'eu-west-1': { name: 'Europe', priority: 1 },
    'ap-southeast-1': { name: 'Asia Pacific', priority: 1 }
  },
  
  // Game modes
  GAME_MODES: {
    'ranked-1v1': {
      name: 'Ranked 1v1',
      minPlayers: 2,
      maxPlayers: 2,
      skillVarianceThreshold: 100,
      latencyThreshold: 100
    },
    'ranked-team': {
      name: 'Ranked Team',
      minPlayers: 4,
      maxPlayers: 10,
      skillVarianceThreshold: 200,
      latencyThreshold: 120
    },
    'casual': {
      name: 'Casual',
      minPlayers: 2,
      maxPlayers: 8,
      skillVarianceThreshold: 500,
      latencyThreshold: 150
    }
  }
};
