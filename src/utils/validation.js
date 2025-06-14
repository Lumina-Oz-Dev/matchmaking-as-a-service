const Joi = require('joi');

// Player validation schemas
const playerSchemas = {
  create: Joi.object({
    playerId: Joi.string().min(3).max(50).required(),
    username: Joi.string().min(3).max(30).required(),
    skillRating: Joi.number().min(0).max(5000).default(1000),
    region: Joi.string().valid('us-east', 'us-west', 'eu-west', 'eu-east', 'asia-pacific').required(),
    gameMode: Joi.string().valid('casual', 'ranked', 'tournament').default('casual'),
    preferences: Joi.object({
      maxLatency: Joi.number().min(50).max(500).default(100),
      voiceChat: Joi.boolean().default(false),
      crossPlatform: Joi.boolean().default(true)
    }).default({})
  }),

  update: Joi.object({
    username: Joi.string().min(3).max(30),
    skillRating: Joi.number().min(0).max(5000),
    region: Joi.string().valid('us-east', 'us-west', 'eu-west', 'eu-east', 'asia-pacific'),
    gameMode: Joi.string().valid('casual', 'ranked', 'tournament'),
    preferences: Joi.object({
      maxLatency: Joi.number().min(50).max(500),
      voiceChat: Joi.boolean(),
      crossPlatform: Joi.boolean()
    })
  }).min(1)
};

// Queue validation schemas
const queueSchemas = {
  join: Joi.object({
    playerId: Joi.string().min(3).max(50).required(),
    queueType: Joi.string().valid('casual', 'ranked', 'tournament').required(),
    latency: Joi.number().min(0).max(1000),
    region: Joi.string().valid('us-east', 'us-west', 'eu-west', 'eu-east', 'asia-pacific').required()
  }),

  leave: Joi.object({
    playerId: Joi.string().min(3).max(50).required(),
    queueType: Joi.string().valid('casual', 'ranked', 'tournament').required()
  })
};

// Match validation schemas
const matchSchemas = {
  create: Joi.object({
    players: Joi.array().items(
      Joi.object({
        playerId: Joi.string().required(),
        skillRating: Joi.number().required(),
        latency: Joi.number(),
        region: Joi.string().required()
      })
    ).min(2).max(16).required(),
    gameMode: Joi.string().valid('casual', 'ranked', 'tournament').required(),
    region: Joi.string().valid('us-east', 'us-west', 'eu-west', 'eu-east', 'asia-pacific').required()
  }),

  update: Joi.object({
    status: Joi.string().valid('waiting', 'starting', 'in-progress', 'completed', 'cancelled'),
    result: Joi.object({
      winner: Joi.string(),
      duration: Joi.number(),
      playerStats: Joi.object().pattern(Joi.string(), Joi.object())
    })
  }).min(1)
};

// Lobby validation schemas
const lobbySchemas = {
  create: Joi.object({
    hostPlayerId: Joi.string().min(3).max(50).required(),
    name: Joi.string().min(3).max(100).required(),
    gameMode: Joi.string().valid('casual', 'ranked', 'tournament').required(),
    maxPlayers: Joi.number().min(2).max(16).default(10),
    isPrivate: Joi.boolean().default(false),
    password: Joi.string().min(4).max(20).when('isPrivate', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
    region: Joi.string().valid('us-east', 'us-west', 'eu-west', 'eu-east', 'asia-pacific').required(),
    settings: Joi.object({
      skillRatingRange: Joi.number().min(50).max(1000).default(200),
      maxLatency: Joi.number().min(50).max(500).default(100),
      autoStart: Joi.boolean().default(true)
    }).default({})
  }),

  join: Joi.object({
    playerId: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(4).max(20)
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(100),
    maxPlayers: Joi.number().min(2).max(16),
    settings: Joi.object({
      skillRatingRange: Joi.number().min(50).max(1000),
      maxLatency: Joi.number().min(50).max(500),
      autoStart: Joi.boolean()
    })
  }).min(1)
};

// Latency validation schema
const latencySchema = Joi.object({
  playerId: Joi.string().min(3).max(50).required(),
  region: Joi.string().valid('us-east', 'us-west', 'eu-west', 'eu-east', 'asia-pacific').required(),
  latency: Joi.number().min(0).max(1000).required(),
  timestamp: Joi.date().default(Date.now)
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = {
  playerSchemas,
  queueSchemas,
  matchSchemas,
  lobbySchemas,
  latencySchema,
  validate
};