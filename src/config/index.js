require('dotenv').config();

module.exports = {
  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // AWS Configuration
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    dynamoDbTable: process.env.DYNAMODB_TABLE || 'matchmaking-dev',
    redisEndpoint: process.env.REDIS_ENDPOINT || 'localhost:6379',
    webSocketApiId: process.env.WEBSOCKET_API_ID
  },
  
  // Matchmaking Configuration
  matchmaking: {
    maxPlayersPerMatch: parseInt(process.env.MAX_PLAYERS_PER_MATCH) || 10,
    matchTimeoutSeconds: parseInt(process.env.MATCH_TIMEOUT_SECONDS) || 60,
    skillRatingRange: parseInt(process.env.SKILL_RATING_RANGE) || 200,
    latencyThresholdMs: parseInt(process.env.LATENCY_THRESHOLD_MS) || 100,
    
    // Matchmaking algorithm weights
    weights: {
      skillRating: 0.6,
      latency: 0.3,
      waitTime: 0.1
    },
    
    // Queue configurations for different game modes
    queues: {
      casual: {
        minPlayers: 2,
        maxPlayers: 10,
        skillRatingRange: 300,
        maxWaitTimeSeconds: 120
      },
      ranked: {
        minPlayers: 2,
        maxPlayers: 10,
        skillRatingRange: 150,
        maxWaitTimeSeconds: 300
      },
      tournament: {
        minPlayers: 8,
        maxPlayers: 16,
        skillRatingRange: 100,
        maxWaitTimeSeconds: 600
      }
    }
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  
  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    apiKey: process.env.API_KEY
  },
  
  // Redis Configuration
  redis: {
    host: process.env.REDIS_ENDPOINT ? process.env.REDIS_ENDPOINT.split(':')[0] : 'localhost',
    port: process.env.REDIS_ENDPOINT ? parseInt(process.env.REDIS_ENDPOINT.split(':')[1]) : 6379,
    password: process.env.REDIS_PASSWORD,
    db: 0,
    keyPrefix: 'matchmaking:',
    ttl: {
      player: 3600, // 1 hour
      match: 1800,  // 30 minutes
      lobby: 7200   // 2 hours
    }
  }
};