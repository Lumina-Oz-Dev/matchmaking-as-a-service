const redis = require('redis');
const config = require('../config');
const logger = require('../utils/logger');

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = redis.createClient({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        db: config.redis.db,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            logger.error('Redis connection refused');
            return new Error('Redis connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            logger.error('Redis retry time exhausted');
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            logger.error('Redis max retry attempts reached');
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        logger.error('Redis client error:', err);
        this.isConnected = false;
      });

      this.client.on('end', () => {
        logger.info('Redis client disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  // Key generation helpers
  getPlayerKey(playerId) {
    return `${config.redis.keyPrefix}player:${playerId}`;
  }

  getMatchKey(matchId) {
    return `${config.redis.keyPrefix}match:${matchId}`;
  }

  getLobbyKey(lobbyId) {
    return `${config.redis.keyPrefix}lobby:${lobbyId}`;
  }

  getQueueKey(queueType) {
    return `${config.redis.keyPrefix}queue:${queueType}`;
  }

  getLatencyKey(region) {
    return `${config.redis.keyPrefix}latency:${region}`;
  }

  // Player operations
  async setPlayerData(playerId, data, ttl = config.redis.ttl.player) {
    const key = this.getPlayerKey(playerId);
    await this.client.setEx(key, ttl, JSON.stringify(data));
  }

  async getPlayerData(playerId) {
    const key = this.getPlayerKey(playerId);
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deletePlayerData(playerId) {
    const key = this.getPlayerKey(playerId);
    await this.client.del(key);
  }

  // Match operations
  async setMatchData(matchId, data, ttl = config.redis.ttl.match) {
    const key = this.getMatchKey(matchId);
    await this.client.setEx(key, ttl, JSON.stringify(data));
  }

  async getMatchData(matchId) {
    const key = this.getMatchKey(matchId);
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteMatchData(matchId) {
    const key = this.getMatchKey(matchId);
    await this.client.del(key);
  }

  // Lobby operations
  async setLobbyData(lobbyId, data, ttl = config.redis.ttl.lobby) {
    const key = this.getLobbyKey(lobbyId);
    await this.client.setEx(key, ttl, JSON.stringify(data));
  }

  async getLobbyData(lobbyId) {
    const key = this.getLobbyKey(lobbyId);
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteLobbyData(lobbyId) {
    const key = this.getLobbyKey(lobbyId);
    await this.client.del(key);
  }

  // Queue operations (using sorted sets for priority queues)
  async addToQueue(queueType, playerId, score, data) {
    const queueKey = this.getQueueKey(queueType);
    const playerDataKey = `${queueKey}:data:${playerId}`;
    
    // Add player to sorted set with score (for priority)
    await this.client.zAdd(queueKey, { score, value: playerId });
    
    // Store player data separately
    await this.client.setEx(playerDataKey, 3600, JSON.stringify(data)); // 1 hour TTL
  }

  async removeFromQueue(queueType, playerId) {
    const queueKey = this.getQueueKey(queueType);
    const playerDataKey = `${queueKey}:data:${playerId}`;
    
    await this.client.zRem(queueKey, playerId);
    await this.client.del(playerDataKey);
  }

  async getQueuePlayers(queueType, limit = 50) {
    const queueKey = this.getQueueKey(queueType);
    const playerIds = await this.client.zRange(queueKey, 0, limit - 1);
    
    const players = [];
    for (const playerId of playerIds) {
      const playerDataKey = `${queueKey}:data:${playerId}`;
      const data = await this.client.get(playerDataKey);
      if (data) {
        players.push({
          playerId,
          ...JSON.parse(data)
        });
      }
    }
    
    return players;
  }

  async getQueueSize(queueType) {
    const queueKey = this.getQueueKey(queueType);
    return await this.client.zCard(queueKey);
  }

  // Latency tracking
  async recordLatency(region, playerId, latency) {
    const latencyKey = this.getLatencyKey(region);
    await this.client.hSet(latencyKey, playerId, latency);
    await this.client.expire(latencyKey, 3600); // 1 hour TTL
  }

  async getPlayerLatency(region, playerId) {
    const latencyKey = this.getLatencyKey(region);
    const latency = await this.client.hGet(latencyKey, playerId);
    return latency ? parseInt(latency) : null;
  }

  async getRegionLatencies(region) {
    const latencyKey = this.getLatencyKey(region);
    return await this.client.hGetAll(latencyKey);
  }

  // Pub/Sub for real-time notifications
  async publish(channel, message) {
    await this.client.publish(channel, JSON.stringify(message));
  }

  async subscribe(channel, callback) {
    const subscriber = this.client.duplicate();
    await subscriber.connect();
    await subscriber.subscribe(channel, (message) => {
      try {
        const data = JSON.parse(message);
        callback(data);
      } catch (error) {
        logger.error('Error parsing pub/sub message:', error);
      }
    });
    return subscriber;
  }

  // Health check
  async ping() {
    return await this.client.ping();
  }
}

module.exports = new RedisService();