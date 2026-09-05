import { Trainer, UserProfile } from '../types';

type MatchLevel = 'Excellent Match' | 'Strong Match' | 'Good Match' | 'Partial Match';

const levelRank: Record<string, number> = {
  Beginner: 1,
  Elementary: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4
};

const normalize = (value: string) => value.trim().toLowerCase();

function scoreLevel(requested: string | undefined, trainerLevel: string) {
  if (!requested) return 50;
  const difference = (levelRank[trainerLevel] || 2) - (levelRank[requested] || 1);
  if (difference < 0) return 20;
  if (difference === 0) return 82;
  if (difference === 1) return 96;
  return 100;
}

function scoreOverlap(requested: string[], available: string[]) {
  if (!requested.length) return 50;
  const matches = requested.filter((value) => available.some((candidate) => normalize(candidate) === normalize(value))).length;
  return Math.round((matches / requested.length) * 100);
}

function getMatchLevel(score: number): MatchLevel {
  if (score >= 90) return 'Excellent Match';
  if (score >= 75) return 'Strong Match';
  if (score >= 60) return 'Good Match';
  return 'Partial Match';
}

export function rankLocalTrainers(
  trainers: Trainer[],
  request: { skill?: string; level?: string; languages?: string[]; goal?: string; teachingStyle?: string },
  user?: UserProfile | null
) {
  const requestedSkill = request.skill && request.skill !== 'all'
    ? request.skill
    : user?.skillsLearning[0] || 'Python';
  const requestedLanguages = request.languages?.filter((language) => language !== 'all') || user?.languages || [];
  const requestedGoal = request.goal || user?.learningGoal;

  return trainers
    .map((trainer) => {
      const matchingSkill = trainer.skills.find((skill) => normalize(skill.name) === normalize(requestedSkill));
      const skillScore = matchingSkill ? 100 : 0;
      const level = matchingSkill?.level.includes('institution') || matchingSkill?.level.includes('community')
        ? 'Advanced'
        : matchingSkill?.level.includes('ai') ? 'Intermediate' : 'Intermediate';
      const levelScore = scoreLevel(request.level || user?.learningLevel, level);
      const languageScore = scoreOverlap(requestedLanguages, trainer.languages);
      const goalScore = requestedGoal
        ? normalize(`${trainer.bio} ${trainer.title} ${trainer.skills.map((skill) => skill.name).join(' ')}`).includes(normalize(requestedGoal)) ? 100 : 65
        : 50;
      const availabilityScore = trainer.status === 'active' ? 100 : trainer.status === 'in-class' ? 65 : 25;
      const score = Math.round(
        skillScore * 0.3 +
        levelScore * 0.15 +
        goalScore * 0.15 +
        availabilityScore * 0.15 +
        languageScore * 0.1 +
        (trainer.rating / 5) * 100 * 0.05 +
        trainer.reliabilityScore * 0.1
      );
      const reasons = matchingSkill ? [`Teaches ${matchingSkill.name}`] : ['Broad peer-learning profile'];
      if (levelScore >= 80) reasons.push(`${level} level supports your learning level`);
      if (languageScore >= 70 && requestedLanguages.length) reasons.push(`Shares ${trainer.languages.filter((language) => requestedLanguages.some((wanted) => normalize(wanted) === normalize(language))).join(' and ')}`);
      if (request.teachingStyle && request.teachingStyle !== 'all' && trainer.teachingStyles.some((style) => normalize(style).includes(normalize(request.teachingStyle!)))) reasons.push('Matches your preferred teaching style');
      if (trainer.rating >= 4.5) reasons.push(`High rating (${trainer.rating.toFixed(1)}/5)`);
      if (trainer.reliabilityScore >= 90) reasons.push(`Reliable peer (${trainer.reliabilityScore}%)`);

      return {
        trainer: {
          ...trainer,
          aiMatchScore: score,
          matchReasons: reasons
        },
        score,
        hasSkill: Boolean(matchingSkill),
        matchLevel: getMatchLevel(score)
      };
    })
    .sort((first, second) => {
      if (first.hasSkill !== second.hasSkill) return first.hasSkill ? -1 : 1;
      return second.score - first.score;
    });
}
