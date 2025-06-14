const AWS = require('aws-sdk');
const { createResponse, validateBody } = require('../../utils/response');
const { broadcastToLobby } = require('../../utils/notifications');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { lobbyId } = event.pathParameters;
    const body = validateBody(event.body, ['playerId']);
    
    // Get player data
    const playerResult = await dynamodb.get({
      TableName: process.env.PLAYERS_TABLE,
      Key: { playerId: body.playerId }
    }).promise();
    
    if (!playerResult.Item) {
      return createResponse(404, {
        message: 'Player not found'
      });
    }
    
    const player = playerResult.Item;
    
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
    
    // Check if lobby is full
    if (lobby.players.length >= lobby.settings.maxPlayers) {
      return createResponse(400, {
        message: 'Lobby is full'
      });
    }
    
    // Check if player is already in lobby
    if (lobby.players.some(p => p.playerId === body.playerId)) {
      return createResponse(400, {
        message: 'Player already in lobby'
      });
    }
    
    // Check password if private lobby
    if (lobby.settings.isPrivate && lobby.settings.password !== body.password) {
      return createResponse(403, {
        message: 'Invalid lobby password'
      });
    }
    
    // Add player to lobby
    const newPlayer = {
      playerId: player.playerId,
      username: player.username,
      skillRating: player.skillRating,
      region: player.region,
      ready: false,
      isHost: false
    };
    
    lobby.players.push(newPlayer);
    lobby.updatedAt = Date.now();
    
    // Update lobby in database
    await dynamodb.put({
      TableName: process.env.LOBBIES_TABLE,
      Item: lobby
    }).promise();
    
    // Notify other players
    await broadcastToLobby(lobby, {
      type: 'PLAYER_JOINED',
      player: newPlayer,
      lobbyId
    }, body.playerId);
    
    return createResponse(200, {
      message: 'Successfully joined lobby',
      lobby: {
        lobbyId: lobby.lobbyId,
        gameMode: lobby.gameMode,
        players: lobby.players,
        settings: lobby.settings
      }
    });
  } catch (error) {
    console.error('Error joining lobby:', error);
    return createResponse(500, {
      message: 'Failed to join lobby',
      error: error.message
    });
  }
};