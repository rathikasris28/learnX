export type ReviewSentiment = 'positive' | 'neutral' | 'negative';

const positiveWords = ['good', 'great', 'excellent', 'helpful', 'useful', 'clear', 'easy', 'interactive', 'understand', 'patient', 'best'];
const negativeWords = ['bad', 'poor', 'confusing', 'waste', 'late', 'unhelpful', 'difficult', 'cancelled', 'cancelled'];

export function analyzeReview(text: string | null | undefined) {
  const words = (text || '').toLowerCase().match(/[a-z]+/g) || [];
  const positive = words.filter((word) => positiveWords.includes(word)).length;
  const negative = words.filter((word) => negativeWords.includes(word)).length;
  const score = words.length ? Math.max(0, Math.min(100, 50 + ((positive - negative) / Math.max(1, words.length)) * 100)) : 50;
  const sentiment: ReviewSentiment = positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral';
  return { sentiment, score: Math.round(score) };
}

export function calculateReviewScore(averageRating: number, positivePercentage: number) {
  return Math.round(Math.max(0, Math.min(10, (averageRating / 5) * 6 + (positivePercentage / 100) * 4)) * 10) / 10;
}
