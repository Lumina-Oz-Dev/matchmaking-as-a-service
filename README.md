# Matchmaking as a Service (MaaS)

A sophisticated, scalable matchmaking system built for AWS that provides skill-based matching, latency optimization, and comprehensive lobby management for multiplayer games.

## 🚀 Features

- **Skill-Based Matching**: Advanced ELO rating system with skill brackets
- **Latency Optimization**: Geographic region-based matching for optimal gameplay
- **Real-time Lobby Management**: WebSocket-powered lobby system
- **Auto-scaling**: Built on AWS serverless architecture
- **Game Session Management**: Complete match lifecycle handling
- **Player Statistics**: Comprehensive tracking and analytics
- **RESTful API**: Easy integration with any game client

## 🏗️ Architecture

### AWS Services Used
- **API Gateway**: RESTful API endpoints and WebSocket connections
- **Lambda Functions**: Serverless compute for matchmaking logic
- **DynamoDB**: Player data, match history, and lobby state
- **SQS**: Queue system for match processing
- **CloudWatch**: Monitoring and logging
- **Cognito**: Player authentication (optional)
- **ElastiCache**: Redis for real-time session management

### System Components
1. **Player Service**: Registration, profiles, and skill ratings
2. **Matchmaking Engine**: Core matching algorithms
3. **Lobby Manager**: Real-time lobby operations
4. **Game Session Service**: Match lifecycle management
5. **Analytics Service**: Player statistics and insights

## 📋 Prerequisites

- AWS Account with appropriate permissions
- Node.js 18+ and npm
- AWS CLI configured
- Serverless Framework (optional but recommended)

## 🛠️ Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/Lumina-Oz-Dev/matchmaking-as-a-service.git
cd matchmaking-as-a-service
npm install
```

### 2. Configure AWS
```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with your AWS settings
```

### 3. Deploy to AWS
```bash
# Deploy infrastructure
npm run deploy

# Initialize database tables
npm run setup-db
```

### 4. Test the System
```bash
# Run integration tests
npm test

# Test matchmaking
curl -X POST https://your-api-gateway-url/dev/matchmaking/queue \
  -H "Content-Type: application/json" \
  -d '{"playerId": "player123", "gameMode": "ranked", "region": "us-east-1"}'
```

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [AWS Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture Deep Dive](./docs/ARCHITECTURE.md)
- [Configuration Guide](./docs/CONFIGURATION.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## 🎮 Game Integration Examples

### Unity Integration
```csharp
// Example Unity C# integration
using UnityEngine;
using System.Collections;

public class MatchmakingClient : MonoBehaviour {
    public void JoinMatchmaking() {
        StartCoroutine(QueueForMatch("player123", "ranked"));
    }
    
    IEnumerator QueueForMatch(string playerId, string gameMode) {
        // Implementation in examples/unity/
    }
}
```

### Unreal Engine Integration
```cpp
// Example Unreal C++ integration
#include "MatchmakingSubsystem.h"

void UMatchmakingSubsystem::QueueForMatch(const FString& PlayerId, const FString& GameMode) {
    // Implementation in examples/unreal/
}
```

## 🔧 Configuration

### Environment Variables
```bash
# AWS Configuration
AWS_REGION=us-east-1
DYNAMODB_TABLE_PREFIX=maas
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/your-queue

# Matchmaking Settings
MATCH_TIMEOUT_SECONDS=60
MAX_SKILL_DIFFERENCE=200
REGION_LATENCY_THRESHOLD=150

# Game Settings
MIN_PLAYERS_PER_MATCH=2
MAX_PLAYERS_PER_MATCH=10
SUPPORTED_GAME_MODES=casual,ranked,tournament
```

## 📊 Monitoring

The system includes comprehensive monitoring:
- CloudWatch dashboards for real-time metrics
- Automated alerts for system health
- Player analytics and match quality metrics
- Cost optimization recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 💬 Support

For support and questions:
- Create an issue in this repository
- Check the [troubleshooting guide](./docs/TROUBLESHOOTING.md)
- Review the [FAQ](./docs/FAQ.md)

---

**Built with ❤️ for the gaming community**