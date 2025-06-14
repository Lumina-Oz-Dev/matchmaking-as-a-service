import { MATCHMAKING_CONFIG } from '../config/matchmaking';
import { LatencyInfo } from '../types/common';

/**
 * Calculate weighted latency score for matchmaking
 */
export function calculateLatencyScore(
  playerLatency: number,
  maxAcceptableLatency: number = MATCHMAKING_CONFIG.LATENCY.MAX_ACCEPTABLE
): number {
  if (playerLatency > maxAcceptableLatency) return 0;
  
  // Higher score for lower latency
  return Math.max(0, (maxAcceptableLatency - playerLatency) / maxAcceptableLatency);
}

/**
 * Check if latency is acceptable for matchmaking
 */
export function isLatencyAcceptable(
  latency: number,
  threshold: number = MATCHMAKING_CONFIG.LATENCY.MAX_ACCEPTABLE
): boolean {
  return latency <= threshold;
}

/**
 * Calculate average latency for a group of players
 */
export function calculateAverageLatency(latencies: number[]): number {
  if (latencies.length === 0) return 0;
  
  const sum = latencies.reduce((acc, latency) => acc + latency, 0);
  return Math.round(sum / latencies.length);
}

/**
 * Find best region for a group of players based on latency
 */
export function findBestRegion(playerLatencies: LatencyInfo[][]): string {
  const regionScores: { [region: string]: number } = {};
  
  // Calculate total latency score for each region
  for (const playerLatencyData of playerLatencies) {
    for (const latencyInfo of playerLatencyData) {
      if (!regionScores[latencyInfo.region]) {
        regionScores[latencyInfo.region] = 0;
      }
      regionScores[latencyInfo.region] += calculateLatencyScore(latencyInfo.latency);
    }
  }
  
  // Find region with highest total score
  let bestRegion = 'us-east-1'; // default
  let bestScore = 0;
  
  for (const [region, score] of Object.entries(regionScores)) {
    if (score > bestScore) {
      bestScore = score;
      bestRegion = region;
    }
  }
  
  return bestRegion;
}

/**
 * Estimate latency between two regions (simplified)
 */
export function estimateInterRegionLatency(region1: string, region2: string): number {
  if (region1 === region2) return 0;
  
  // Simplified latency estimation based on geographical distance
  const latencyMap: { [key: string]: number } = {
    'us-east-1_us-west-2': 70,
    'us-east-1_eu-west-1': 80,
    'us-east-1_ap-southeast-1': 180,
    'us-west-2_eu-west-1': 140,
    'us-west-2_ap-southeast-1': 120,
    'eu-west-1_ap-southeast-1': 160
  };
  
  const key1 = `${region1}_${region2}`;
  const key2 = `${region2}_${region1}`;
  
  return latencyMap[key1] || latencyMap[key2] || 100; // default
}
