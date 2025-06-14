const { calculateMatchQuality } = require('./skillRating');

const MAX_SKILL_DIFF = 200;
const MAX_LATENCY_DIFF = 50;
const PLAYERS_PER_MATCH = {
  casual: 10,
  ranked: 2,
  tournament: 8
};

exports.findMatches = (queuedPlayers, gameMode) => {
  const matches = [];
  const playersPerMatch = PLAYERS_PER_MATCH[gameMode] || 2;
  const used = new Set();
  
  // Sort players by skill rating for better matching
  const sortedPlayers = [...queuedPlayers].sort((a, b) => a.skillRating - b.skillRating);
  
  for (const player of sortedPlayers) {
    if (used.has(player.playerId)) continue;
    
    const match = {
      players: [player],
      averageRating: player.skillRating,
      quality: 100
    };
    
    // Find compatible players
    for (const candidate of sortedPlayers) {
      if (used.has(candidate.playerId)) continue;
      if (candidate.playerId === player.playerId) continue;
      if (match.players.length >= playersPerMatch) break;
      
      // Check compatibility
      if (isCompatible(player, candidate, gameMode)) {
        match.players.push(candidate);
      }
    }
    
    // Only create match if we have enough players
    if (match.players.length >= 2 && (gameMode === 'ranked' || match.players.length >= playersPerMatch / 2)) {
      // Calculate match quality
      match.quality = calculateMatchQuality(match.players);
      match.averageRating = Math.round(
        match.players.reduce((sum, p) => sum + p.skillRating, 0) / match.players.length
      );
      
      // Mark players as used
      match.players.forEach(p => used.add(p.playerId));
      matches.push(match);
    }
  }
  
  return matches;
};

function isCompatible(player1, player2, gameMode) {
  // Skill-based compatibility
  const skillDiff = Math.abs(player1.skillRating - player2.skillRating);
  const maxAllowedDiff = MAX_SKILL_DIFF + (player1.searchExpansion || 0) * 50;
  
  if (skillDiff > maxAllowedDiff) {
    return false;
  }
  
  // Region-based compatibility (simplified - in production, use actual latency data)
  if (player1.region !== player2.region) {
    // Allow cross-region only for casual mode or after search expansion
    if (gameMode === 'ranked' && (player1.searchExpansion || 0) < 2) {
      return false;
    }
  }
  
  return true;
}