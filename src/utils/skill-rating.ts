import { MATCHMAKING_CONFIG } from '../config/matchmaking';

/**
 * Calculate new skill rating using ELO algorithm
 */
export function calculateEloRating(
  playerRating: number,
  opponentRating: number,
  actualScore: number, // 1 for win, 0.5 for draw, 0 for loss
  kFactor: number = MATCHMAKING_CONFIG.SKILL_RATING.K_FACTOR
): number {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  const newRating = playerRating + kFactor * (actualScore - expectedScore);
  
  return Math.max(
    MATCHMAKING_CONFIG.SKILL_RATING.MIN_RATING,
    Math.min(MATCHMAKING_CONFIG.SKILL_RATING.MAX_RATING, Math.round(newRating))
  );
}

/**
 * Calculate team average rating
 */
export function calculateTeamRating(playerRatings: number[]): number {
  if (playerRatings.length === 0) return MATCHMAKING_CONFIG.SKILL_RATING.DEFAULT_RATING;
  
  const sum = playerRatings.reduce((acc, rating) => acc + rating, 0);
  return Math.round(sum / playerRatings.length);
}

/**
 * Check if players are within acceptable skill range
 */
export function isSkillRangeCompatible(
  playerRating: number,
  targetRating: number,
  maxDifference: number = MATCHMAKING_CONFIG.SKILL_RATING.MAX_SKILL_DIFFERENCE
): boolean {
  return Math.abs(playerRating - targetRating) <= maxDifference;
}

/**
 * Calculate skill variance for a group of players
 */
export function calculateSkillVariance(ratings: number[]): number {
  if (ratings.length <= 1) return 0;
  
  const mean = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  const variance = ratings.reduce((sum, rating) => sum + Math.pow(rating - mean, 2), 0) / ratings.length;
  
  return Math.sqrt(variance);
}

/**
 * Determine if a player needs placement matches
 */
export function needsPlacementMatches(matchesPlayed: number): boolean {
  return matchesPlayed < MATCHMAKING_CONFIG.SKILL_RATING.PLACEMENT_MATCHES;
}
