const AWS = require('aws-sdk');

const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
  endpoint: process.env.WEBSOCKET_ENDPOINT
});

exports.notifyPlayers = async (players, message) => {
  const notifications = players.map(async (player) => {
    if (!player.connectionId) {
      console.log(`Player ${player.playerId} has no active WebSocket connection`);
      return;
    }
    
    try {
      await apigatewaymanagementapi.postToConnection({
        ConnectionId: player.connectionId,
        Data: JSON.stringify(message)
      }).promise();
    } catch (error) {
      if (error.statusCode === 410) {
        console.log(`Stale connection ${player.connectionId} for player ${player.playerId}`);
        // In production, clean up stale connections from database
      } else {
        console.error(`Failed to notify player ${player.playerId}:`, error);
      }
    }
  });
  
  await Promise.all(notifications);
};

exports.broadcastToLobby = async (lobby, message, excludePlayerId = null) => {
  const playersToNotify = lobby.players.filter(p => p.playerId !== excludePlayerId);
  await exports.notifyPlayers(playersToNotify, message);
};