export const MATCHMAKING_CONFIG = {
  // Skill rating constants
  DEFAULT_SKILL_RATING: 1000,
  MIN_SKILL_RATING: 0,
  MAX_SKILL_RATING: 3000,
  SKILL_RATING_K_FACTOR: 32,
  
  // Latency constants
  MAX_ACCEPTABLE_LATENCY: 150,
  LATENCY_WEIGHT: 0.3,
  
  // Queue settings
  MAX_QUEUE_TIME: 300000, // 5 minutes
  QUEUE_EXPANSION_INTERVAL: 30000, // 30 seconds
  SKILL_RANGE_EXPANSION_RATE: 50,
  LATENCY_EXPANSION_RATE: 25,
  
  // Match settings
  DEFAULT_MATCH_SIZE: 2,
  MIN_MATCH_SIZE: 2,
  MAX_MATCH_SIZE: 10,
  MATCH_TIMEOUT: 30000, // 30 seconds to accept
  
  // Lobby settings
  MAX_LOBBY_SIZE: 8,
  LOBBY_READY_TIMEOUT: 60000, // 1 minute
  LOBBY_IDLE_TIMEOUT: 300000, // 5 minutes
  
  // Regional settings
  SUPPORTED_REGIONS: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
  CROSS_REGION_LATENCY_PENALTY: 100,
  
  // Ranking tiers
  SKILL_TIERS: {
    BRONZE: { min: 0, max: 999 },
    SILVER: { min: 1000, max: 1499 },
    GOLD: { min: 1500, max: 1999 },
    PLATINUM: { min: 2000, max: 2499 },
    DIAMOND: { min: 2500, max: 2999 },
    MASTER: { min: 3000, max: 3000 }
  }
};

export const AWS_CONFIG = {
  DYNAMODB_TABLE_PREFIX: 'matchmaking',
  SQS_QUEUE_PREFIX: 'matchmaking',
  SNS_TOPIC_PREFIX: 'matchmaking',
  LAMBDA_TIMEOUT: 30,
  LAMBDA_MEMORY: 512,
  
  // DynamoDB settings
  READ_CAPACITY: 5,
  WRITE_CAPACITY: 5,
  
  // SQS settings
  VISIBILITY_TIMEOUT: 60,
  MESSAGE_RETENTION_PERIOD: 1209600, // 14 days
  
  // CloudWatch settings
  LOG_RETENTION_DAYS: 30
};