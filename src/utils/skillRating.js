// ELO-based skill rating system
const K_FACTOR = 32; // Determines how much ratings change after a match
const INITIAL_RATING = 1200;
const MIN_RATING = 100;
const MAX_RATING = 3000;

exports.calculateInitialRating = () => {
  return INITIAL_RATING;
};

exports.updateSkillRating = (playerRating, opponentRating, won) => {
  // Calculate expected score
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  
  // Actual score (1 for win, 0 for loss)
  const actualScore = won ? 1 : 0;
  
  // Calculate new rating
  const newRating = playerRating + K_FACTOR * (actualScore - expectedScore);
  
  // Ensure rating stays within bounds
  return Math.max(MIN_RATING, Math.min(MAX_RATING, Math.round(newRating)));
};

exports.getSkillBracket = (rating) => {
  if (rating < 800) return 'BRONZE';
  if (rating < 1200) return 'SILVER';
  if (rating < 1600) return 'GOLD';
  if (rating < 2000) return 'PLATINUM';
  if (rating < 2400) return 'DIAMOND';
  return 'MASTER';
};

exports.calculateMatchQuality = (players) => {
  if (players.length < 2) return 0;
  
  const ratings = players.map(p => p.skillRating);
  const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  
  // Calculate standard deviation
  const variance = ratings.reduce((acc, rating) => {
    return acc + Math.pow(rating - avgRating, 2);
  }, 0) / ratings.length;
  
  const stdDev = Math.sqrt(variance);
  
  // Quality decreases as skill disparity increases
  // Perfect match = 100, poor match < 50
  const quality = Math.max(0, 100 - (stdDev / 10));
  
  return Math.round(quality);
};