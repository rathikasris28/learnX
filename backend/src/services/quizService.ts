import { query } from '../config/database.js';
import { SkillLevel } from './matchingService.js';

const questionCounts: Record<SkillLevel, number> = { Beginner: 10, Elementary: 10, Intermediate: 15, Advanced: 20, Expert: 20 };

type QuizQuestion = { prompt: string; options: string[]; correctOption: number; category: string };

function createQuestions(skill: string, level: SkillLevel): QuizQuestion[] {
  const normalizedSkill = skill.toLowerCase();
  const templates: QuizQuestion[] = normalizedSkill === 'python'
    ? [
        { prompt: 'What is the output of print(2 + 3)?', options: ['23', '5', 'Error', 'None'], correctOption: 1, category: 'multiple-choice' },
        { prompt: 'Which keyword defines a function in Python?', options: ['func', 'define', 'def', 'function'], correctOption: 2, category: 'multiple-choice' },
        { prompt: 'Which collection is ordered and mutable?', options: ['Tuple', 'List', 'Set', 'Frozen set'], correctOption: 1, category: 'concept' },
        { prompt: 'What does len([1, 2, 3]) return?', options: ['2', '3', '4', 'None'], correctOption: 1, category: 'code-understanding' },
        { prompt: 'Which value represents no value?', options: ['0', 'False', 'None', 'Empty'], correctOption: 2, category: 'concept' }
      ]
    : [
        { prompt: `Which approach best demonstrates understanding of ${skill}?`, options: ['Memorizing terms only', 'Applying the concept to a practical problem', 'Avoiding feedback', 'Skipping fundamentals'], correctOption: 1, category: 'scenario' },
        { prompt: `What should a learner do first when solving a ${skill} problem?`, options: ['Clarify requirements', 'Guess randomly', 'Skip testing', 'Copy an answer'], correctOption: 0, category: 'problem-solving' },
        { prompt: `Which is a reliable way to improve ${skill}?`, options: ['Practice and review feedback', 'Avoid exercises', 'Use one source only', 'Never revisit mistakes'], correctOption: 0, category: 'scenario' }
      ];
  return Array.from({ length: questionCounts[level] }, (_, index) => templates[index % templates.length]);
}

function verification(score: number, selectedLevel: SkillLevel) {
  const status = score < 40 ? 'not-verified' : score < 60 ? 'basic-knowledge' : score < 80 ? 'verified' : 'highly-verified';
  const selectedRank = { Beginner: 1, Elementary: 1, Intermediate: 2, Advanced: 3, Expert: 4 }[selectedLevel];
  const verifiedRank = score < 40 ? 1 : score < 60 ? Math.max(1, selectedRank - 1) : score < 80 ? selectedRank : selectedRank;
  const verifiedLevel = Object.entries({ Beginner: 1, Elementary: 1, Intermediate: 2, Advanced: 3, Expert: 4 }).find(([, rank]) => rank === verifiedRank)?.[0] || 'Beginner';
  return { status, verifiedLevel };
}

export async function startQuiz(userId: string, skill: string, level: SkillLevel) {
  const skillResult = await query<{ id: string; name: string }>('SELECT id, name FROM skills WHERE LOWER(name) = LOWER($1)', [skill]);
  const skillRow = skillResult.rows[0];
  if (!skillRow) throw new Error('Skill not found');
  const questions = createQuestions(skillRow.name, level);
  const quizResult = await query<{ id: string }>('INSERT INTO skill_quizzes (skill_id, level, question_count) VALUES ($1, $2, $3) RETURNING id', [skillRow.id, level, questions.length]);
  const quizId = quizResult.rows[0].id;
  for (const question of questions) {
    await query('INSERT INTO quiz_questions (quiz_id, prompt, options, correct_option, category) VALUES ($1, $2, $3::jsonb, $4, $5)', [quizId, question.prompt, JSON.stringify(question.options), question.correctOption, question.category]);
  }
  const attempt = await query<{ id: string }>('INSERT INTO quiz_attempts (quiz_id, user_id, skill_id, selected_level) VALUES ($1, $2, $3, $4) RETURNING id', [quizId, userId, skillRow.id, level]);
  return { attemptId: attempt.rows[0].id, skill: skillRow.name, level, questions: questions.map(({ prompt, options, category }, index) => ({ id: index, prompt, options, category })) };
}

export async function submitQuiz(userId: string, attemptId: string, answers: number[]) {
  const result = await query<{ quiz_id: string; skill_id: string; selected_level: SkillLevel; question_count: number }>('SELECT qa.quiz_id, qa.skill_id, qa.selected_level, sq.question_count FROM quiz_attempts qa JOIN skill_quizzes sq ON sq.id = qa.quiz_id WHERE qa.id = $1 AND qa.user_id = $2 AND qa.completed_at IS NULL', [attemptId, userId]);
  const attempt = result.rows[0];
  if (!attempt) throw new Error('Quiz attempt not found or already completed');
  const questions = await query<{ correct_option: number }>('SELECT correct_option FROM quiz_questions WHERE quiz_id = $1 ORDER BY id', [attempt.quiz_id]);
  const correct = answers.reduce((total, answer, index) => total + (questions.rows[index]?.correct_option === answer ? 1 : 0), 0);
  const score = Math.round((correct / Math.max(1, questions.rowCount || attempt.question_count)) * 100);
  const resultInfo = verification(score, attempt.selected_level);
  await query('UPDATE quiz_attempts SET answers = $1::jsonb, correct_answers = $2, score = $3, verification_status = $4, verified_level = $5, completed_at = NOW() WHERE id = $6', [JSON.stringify(answers), correct, score, resultInfo.status, resultInfo.verifiedLevel, attemptId]);
  await query('UPDATE user_skills SET quiz_score = $1, ai_verified_level = $2, verification_status = $3 WHERE user_id = $4 AND skill_id = $5 AND direction = \'teach\'', [score, resultInfo.verifiedLevel, resultInfo.status, userId, attempt.skill_id]);
  return { attemptId, score, correctAnswers: correct, verificationStatus: resultInfo.status, verifiedLevel: resultInfo.verifiedLevel };
}

export async function getQuizResult(userId: string, attemptId: string) {
  const result = await query('SELECT * FROM quiz_attempts WHERE id = $1 AND user_id = $2', [attemptId, userId]);
  if (!result.rows[0]) throw new Error('Quiz attempt not found');
  return result.rows[0];
}
