const { v4: uuidv4 } = require('uuid');
const config = require('../config');

// Generate unique IDs
const generateId = (prefix = '') => {
  const id = uuidv4();
  return prefix ? `${prefix}_${id}` : id;
};

// Generate match ID
const generateMatchId = () => generateId('match');

// Generate lobby ID
const generateLobbyId = () => generateId('lobby');

// Calculate skill rating difference between players
const getSkillRatingDifference = (player1Rating, player2Rating) => {
  return Math.abs(player1Rating - player2Rating);
};

// Check if two players are compatible based on skill rating
const arePlayersSkillCompatible = (player1, player2, maxDifference = config.matchmaking.skillRatingRange) => {
  return getSkillRatingDifference(player1.skillRating, player2.skillRating) <= maxDifference;
};

// Calculate average skill rating for a group of players
const calculateAverageSkillRating = (players) => {
  if (!players || players.length === 0) return 0;
  const totalRating = players.reduce((sum, player) => sum + player.skillRating, 0);
  return Math.round(totalRating / players.length);
};

// Calculate match quality score based on skill rating balance
const calculateMatchQuality = (players) => {
  if (!players || players.length < 2) return 0;
  
  const avgRating = calculateAverageSkillRating(players);
  const variance = players.reduce((sum, player) => {
    return sum + Math.pow(player.skillRating - avgRating, 2);
  }, 0) / players.length;
  
  // Lower variance = higher quality (scale from 0-100)
  const maxVariance = Math.pow(config.matchmaking.skillRatingRange, 2);
  const quality = Math.max(0, 100 - (variance / maxVariance) * 100);
  
  return Math.round(quality);
};

// Calculate latency compatibility score
const calculateLatencyScore = (players, region) => {
  if (!players || players.length === 0) return 0;
  
  const latencies = players
    .map(p => p.latency || 0)
    .filter(l => l > 0);
  
  if (latencies.length === 0) return 50; // Default score if no latency data
  
  const avgLatency = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
  const maxLatency = Math.max(...latencies);
  
  // Better score for lower average and max latency
  const avgScore = Math.max(0, 100 - (avgLatency / config.matchmaking.latencyThresholdMs) * 50);
  const maxScore = Math.max(0, 100 - (maxLatency / (config.matchmaking.latencyThresholdMs * 2)) * 50);
  
  return Math.round((avgScore + maxScore) / 2);
};

// Calculate wait time factor for matchmaking priority
const calculateWaitTimeFactor = (joinedAt) => {
  const waitTimeMs = Date.now() - new Date(joinedAt).getTime();
  const waitTimeMinutes = waitTimeMs / (1000 * 60);
  
  // Increase priority with wait time (exponential curve)
  return Math.min(100, Math.pow(waitTimeMinutes / 5, 1.5) * 10);
};

// Calculate overall matchmaking score
const calculateMatchmakingScore = (players, referencePlayer) => {
  const weights = config.matchmaking.weights;
  
  // Skill rating compatibility
  const skillScore = 100 - (getSkillRatingDifference(
    calculateAverageSkillRating(players),
    referencePlayer.skillRating
  ) / config.matchmaking.skillRatingRange) * 100;
  
  // Latency score
  const latencyScore = calculateLatencyScore([...players, referencePlayer]);
  
  // Wait time factor
  const waitTimeScore = calculateWaitTimeFactor(referencePlayer.joinedAt);
  
  // Weighted average
  const totalScore = (
    Math.max(0, skillScore) * weights.skillRating +
    latencyScore * weights.latency +
    waitTimeScore * weights.waitTime
  );
  
  return Math.round(totalScore);
};

// Validate region compatibility
const areRegionsCompatible = (region1, region2) => {
  const regionGroups = {
    'americas': ['us-east', 'us-west'],
    'europe': ['eu-west', 'eu-east'],
    'asia': ['asia-pacific']
  };
  
  // Same region is always compatible
  if (region1 === region2) return true;
  
  // Check if regions are in the same group
  for (const group of Object.values(regionGroups)) {
    if (group.includes(region1) && group.includes(region2)) {
      return true;
    }
  }
  
  return false;
};

// Get optimal region for a group of players
const getOptimalRegion = (players) => {
  if (!players || players.length === 0) return null;
  
  // Count players by region
  const regionCounts = {};
  players.forEach(player => {
    regionCounts[player.region] = (regionCounts[player.region] || 0) + 1;
  });
  
  // Find region with most players
  let maxCount = 0;
  let optimalRegion = null;
  
  Object.entries(regionCounts).forEach(([region, count]) => {
    if (count > maxCount) {
      maxCount = count;
      optimalRegion = region;
    }
  });
  
  return optimalRegion;
};

// Format player for public API response
const formatPlayerPublic = (player) => {
  if (!player) return null;
  
  return {
    playerId: player.playerId,
    username: player.username,
    skillRating: player.skillRating,
    region: player.region,
    gameMode: player.gameMode,
    isOnline: player.isOnline || false,
    lastSeen: player.updatedAt
  };
};

// Format match for public API response
const formatMatchPublic = (match) => {
  if (!match) return null;
  
  return {
    matchId: match.matchId,
    status: match.status,
    gameMode: match.gameMode,
    region: match.region,
    players: match.players ? match.players.map(formatPlayerPublic) : [],
    createdAt: match.createdAt,
    startedAt: match.startedAt,
    completedAt: match.completedAt,
    quality: match.quality
  };
};

// Format lobby for public API response
const formatLobbyPublic = (lobby) => {
  if (!lobby) return null;
  
  return {
    lobbyId: lobby.lobbyId,
    name: lobby.name,
    hostPlayerId: lobby.hostPlayerId,
    status: lobby.status,
    gameMode: lobby.gameMode,
    region: lobby.region,
    currentPlayers: lobby.players ? lobby.players.length : 0,
    maxPlayers: lobby.maxPlayers,
    isPrivate: lobby.isPrivate,
    settings: lobby.settings,
    createdAt: lobby.createdAt
  };
};

// Error response helper
const createErrorResponse = (message, statusCode = 400, details = null) => {
  return {
    success: false,
    message,
    statusCode,
    details,
    timestamp: new Date().toISOString()
  };
};

// Success response helper
const createSuccessResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  generateId,
  generateMatchId,
  generateLobbyId,
  getSkillRatingDifference,
  arePlayersSkillCompatible,
  calculateAverageSkillRating,
  calculateMatchQuality,
  calculateLatencyScore,
  calculateWaitTimeFactor,
  calculateMatchmakingScore,
  areRegionsCompatible,
  getOptimalRegion,
  formatPlayerPublic,
  formatMatchPublic,
  formatLobbyPublic,
  createErrorResponse,
  createSuccessResponse
};
