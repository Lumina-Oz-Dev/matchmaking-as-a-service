const AWS = require('aws-sdk');
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
    
    // Find player in lobby
    const playerIndex = lobby.players.findIndex(p => p.playerId === body.playerId);
    if (playerIndex === -1) {
      return createResponse(400, {
        message: 'Player not in lobby'
      });
    }
    
    const leavingPlayer = lobby.players[playerIndex];
    lobby.players.splice(playerIndex, 1);
    
    // Handle host leaving
    if (leavingPlayer.isHost && lobby.players.length > 0) {
      // Assign new host
      lobby.players[0].isHost = true;
      lobby.hostPlayerId = lobby.players[0].playerId;
    }
    
    // Update or delete lobby
    if (lobby.players.length === 0) {
      // Delete empty lobby
      await dynamodb.delete({
        TableName: process.env.LOBBIES_TABLE,
        Key: { lobbyId }
      }).promise();
    } else {
      // Update lobby
      lobby.updatedAt = Date.now();
      await dynamodb.put({
        TableName: process.env.LOBBIES_TABLE,
        Item: lobby
      }).promise();
      
      // Notify remaining players
      await broadcastToLobby(lobby, {
        type: 'PLAYER_LEFT',
        playerId: body.playerId,
        newHost: leavingPlayer.isHost ? lobby.players[0] : null,
        lobbyId
      });
    }
    
    return createResponse(200, {
      message: 'Successfully left lobby',
      playerId: body.playerId
    });
  } catch (error) {
    console.error('Error leaving lobby:', error);
    return createResponse(500, {
      message: 'Failed to leave lobby',
      error: error.message
    });
  }
};