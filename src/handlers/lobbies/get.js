const AWS = require('aws-sdk');
const { createResponse } = require('../../utils/response');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { lobbyId } = event.pathParameters;
    
    const result = await dynamodb.get({
      TableName: process.env.LOBBIES_TABLE,
      Key: { lobbyId }
    }).promise();
    
    if (!result.Item) {
      return createResponse(404, {
        message: 'Lobby not found'
      });
    }
    
    return createResponse(200, {
      lobby: result.Item
    });
  } catch (error) {
    console.error('Error getting lobby:', error);
    return createResponse(500, {
      message: 'Failed to get lobby',
      error: error.message
    });
  }
};