import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const config: DynamoDBClientConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
};

// For local development
if (process.env.NODE_ENV === 'development') {
  config.endpoint = 'http://localhost:8000';
  config.credentials = {
    accessKeyId: 'local',
    secretAccessKey: 'local'
  };
}

export const dynamoClient = new DynamoDBClient(config);
export const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Table names
export const TABLES = {
  PLAYERS: process.env.PLAYERS_TABLE || 'matchmaking-players',
  MATCHES: process.env.MATCHES_TABLE || 'matchmaking-matches',
  LOBBIES: process.env.LOBBIES_TABLE || 'matchmaking-lobbies',
  QUEUE: process.env.QUEUE_TABLE || 'matchmaking-queue',
  PLAYER_STATS: process.env.PLAYER_STATS_TABLE || 'matchmaking-player-stats'
};
