const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { createResponse, validateBody } = require('../../utils/response');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const body = validateBody(event.body, ['hostPlayerId', 'gameMode']);
    
    // Get host player data
    const playerResult = await dynamodb.get({
      TableName: process.env.PLAYERS_TABLE,
      Key: { playerId: body.hostPlayerId }
    }).promise();
    
    if (!playerResult.Item) {
      return createResponse(404, {
        message: 'Host player not found'
      });
    }
    
    const hostPlayer = playerResult.Item;
    const lobbyId = uuidv4();
    const timestamp = Date.now();
    
    const lobby = {
      lobbyId,
      gameMode: body.gameMode,
      hostPlayerId: body.hostPlayerId,
      players: [{
        playerId: hostPlayer.playerId,
        username: hostPlayer.username,
        skillRating: hostPlayer.skillRating,
        region: hostPlayer.region,
        ready: true,
        isHost: true
      }],
      status: 'WAITING',
      createdAt: timestamp,
      updatedAt: timestamp,
      settings: {
        maxPlayers: body.maxPlayers || 10,
        minPlayers: body.minPlayers || 2,
        isPrivate: body.isPrivate || false,
        password: body.password || null,
        customRules: body.customRules || {}
      }
    };
    
    await dynamodb.put({
      TableName: process.env.LOBBIES_TABLE,
      Item: lobby
    }).promise();
    
    return createResponse(201, {
      message: 'Lobby created successfully',
      lobby: {
        lobbyId: lobby.lobbyId,
        gameMode: lobby.gameMode,
        players: lobby.players,
        settings: lobby.settings
      }
    });
  } catch (error) {
    console.error('Error creating lobby:', error);
    return createResponse(500, {
      message: 'Failed to create lobby',
      error: error.message
    });
  }
};