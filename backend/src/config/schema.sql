CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('learner', 'teacher', 'both', 'admin')),
  avatar TEXT,
  country VARCHAR(80),
  state VARCHAR(80),
  city VARCHAR(80),
  languages TEXT[] NOT NULL DEFAULT '{}',
  learning_goal VARCHAR(160),
  teaching_styles TEXT[] NOT NULL DEFAULT '{}',
  availability TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL DEFAULT '',
  is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  terms_version VARCHAR(20),
  terms_accepted_at TIMESTAMPTZ,
  time_credits INTEGER NOT NULL DEFAULT 0 CHECK (time_credits >= 0),
  total_earned_credits INTEGER NOT NULL DEFAULT 0,
  total_used_credits INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
  reliability_score INTEGER NOT NULL DEFAULT 100,
  trust_score INTEGER NOT NULL DEFAULT 90,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS learning_goal VARCHAR(160);
ALTER TABLE users ADD COLUMN IF NOT EXISTS teaching_styles TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS availability TEXT[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS email_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS email_verification_codes_user_idx ON email_verification_codes(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL UNIQUE,
  domain VARCHAR(20) NOT NULL CHECK (domain IN ('technical', 'non-technical')),
  category VARCHAR(120) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  levels TEXT[] NOT NULL DEFAULT ARRAY['Beginner', 'Intermediate', 'Advanced']
);

CREATE TABLE IF NOT EXISTS user_skills (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('teach', 'learn')),
  level VARCHAR(30) NOT NULL,
  self_reported_level VARCHAR(30),
  ai_verified_level VARCHAR(30),
  verification_status VARCHAR(30) NOT NULL DEFAULT 'unverified',
  quiz_score NUMERIC(5,2),
  PRIMARY KEY (user_id, skill_id, direction)
);

ALTER TABLE user_skills ADD COLUMN IF NOT EXISTS self_reported_level VARCHAR(30);
ALTER TABLE user_skills ADD COLUMN IF NOT EXISTS ai_verified_level VARCHAR(30);
ALTER TABLE user_skills ADD COLUMN IF NOT EXISTS verification_status VARCHAR(30) NOT NULL DEFAULT 'unverified';
ALTER TABLE user_skills ADD COLUMN IF NOT EXISTS quiz_score NUMERIC(5,2);

CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES users(id),
  trainer_id UUID NOT NULL REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  topic VARCHAR(200) NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  meeting_room_id VARCHAR(120),
  learner_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  trainer_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS learning_sessions_trainer_time_idx ON learning_sessions(trainer_id, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  session_id UUID REFERENCES learning_sessions(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'used', 'starter', 'refund')),
  amount INTEGER NOT NULL CHECK (amount <> 0),
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE REFERENCES learning_sessions(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  trainer_id UUID NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  sentiment_score NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS sentiment_score NUMERIC(5,2);

CREATE TABLE IF NOT EXISTS skill_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level VARCHAR(30) NOT NULL,
  question_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES skill_quizzes(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option INTEGER NOT NULL,
  category VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES skill_quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  selected_level VARCHAR(30) NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]',
  correct_answers INTEGER NOT NULL DEFAULT 0,
  score NUMERIC(5,2),
  verification_status VARCHAR(30) NOT NULL DEFAULT 'pending',
  verified_level VARCHAR(30),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  email_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  profile_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  quiz_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  session_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  rating_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  review_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  cancellation_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  final_trust_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  skill_match_score NUMERIC(5,2) NOT NULL,
  level_score NUMERIC(5,2) NOT NULL,
  trust_score NUMERIC(5,2) NOT NULL,
  rating_score NUMERIC(5,2) NOT NULL,
  language_score NUMERIC(5,2) NOT NULL,
  availability_score NUMERIC(5,2) NOT NULL,
  location_score NUMERIC(5,2) NOT NULL,
  quiz_score NUMERIC(5,2) NOT NULL,
  final_match_score NUMERIC(5,2) NOT NULL,
  match_reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS match_results_learner_idx ON match_results(learner_id, created_at DESC);

INSERT INTO skills (name, domain, category, description) VALUES
  ('Python', 'technical', 'Programming', 'Programming with Python'),
  ('Java', 'technical', 'Programming', 'Object-oriented programming with Java'),
  ('Web Development', 'technical', 'Web Development', 'Frontend and backend web development'),
  ('Data Science', 'technical', 'Data Science', 'Data analysis and machine learning'),
  ('Public Speaking', 'non-technical', 'Communication', 'Confident and effective public speaking'),
  ('English Speaking', 'non-technical', 'Languages', 'Practical English communication'),
  ('Leadership', 'non-technical', 'Leadership', 'Team leadership and decision-making'),
  ('Photography', 'non-technical', 'Creative', 'Photography fundamentals and composition')
ON CONFLICT (name) DO NOTHING;
