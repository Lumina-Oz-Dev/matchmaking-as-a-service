const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { createResponse, validateBody } = require('../../utils/response');
const { broadcastToLobby } = require('../../utils/notifications');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { lobbyId } = event.pathParameters;
    const body = validateBody(event.body, ['playerId']);
    
    // Get lobby data
    const lobbyResult = await dynamodb.get({
      TableName: process.env.LOBBIES_TABLE,
      Key: { lobbyId }
    }).promise();
    
    if (!lobbyResult.Item) {
      return createResponse(404, {
        message: 'Lobby not found'
      });
    }
    
    const lobby = lobbyResult.Item;
    
    // Verify requester is host
    if (lobby.hostPlayerId !== body.playerId) {
      return createResponse(403, {
        message: 'Only the host can start the match'
      });
    }
    
    // Check minimum players
    if (lobby.players.length < lobby.settings.minPlayers) {
      return createResponse(400, {
        message: `Need at least ${lobby.settings.minPlayers} players to start`
      });
    }
    
    // Check if all players are ready (except in casual mode)
    if (lobby.gameMode !== 'casual') {
      const notReadyPlayers = lobby.players.filter(p => !p.ready);
      if (notReadyPlayers.length > 0) {
        return createResponse(400, {
          message: 'Not all players are ready',
          notReady: notReadyPlayers.map(p => p.username)
        });
      }
    }
    
    // Create match
    const matchId = uuidv4();
    const timestamp = Date.now();
    
    const match = {
      matchId,
      lobbyId,
      gameMode: lobby.gameMode,
      players: lobby.players.map(p => ({
        playerId: p.playerId,
        username: p.username,
        skillRating: p.skillRating,
        team: assignTeam(p, lobby.players),
        score: 0,
        status: 'ACTIVE'
      })),
      status: 'IN_PROGRESS',
      createdAt: timestamp,
      startedAt: timestamp,
      settings: lobby.settings,
      gameServer: {
        ip: generateGameServerIP(),
        port: 7777,
        region: getMostCommonRegion(lobby.players)
      }
    };
    
    // Save match
    await dynamodb.put({
      TableName: process.env.MATCHES_TABLE,
      Item: match
    }).promise();
    
    // Update lobby status
    lobby.status = 'IN_GAME';
    lobby.matchId = matchId;
    lobby.updatedAt = timestamp;
    
    await dynamodb.put({
      TableName: process.env.LOBBIES_TABLE,
      Item: lobby
    }).promise();
    
    // Notify all players
    await broadcastToLobby(lobby, {
      type: 'MATCH_STARTED',
      matchId,
      gameServer: match.gameServer,
      players: match.players
    });
    
    return createResponse(200, {
      message: 'Match started successfully',
      match: {
        matchId: match.matchId,
        gameServer: match.gameServer,
        players: match.players
      }
    });
  } catch (error) {
    console.error('Error starting match:', error);
    return createResponse(500, {
      message: 'Failed to start match',
      error: error.message
    });
  }
};

function assignTeam(player, allPlayers) {
  // Simple team assignment - alternate between teams
  // In production, use more sophisticated balancing
  const playerIndex = allPlayers.findIndex(p => p.playerId === player.playerId);
  return playerIndex % 2 === 0 ? 'TEAM_A' : 'TEAM_B';
}

function generateGameServerIP() {
  // In production, this would allocate a real game server
  // For demo, return a mock IP
  return `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function getMostCommonRegion(players) {
  const regionCounts = {};
  players.forEach(p => {
    regionCounts[p.region] = (regionCounts[p.region] || 0) + 1;
  });
  
  return Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
}