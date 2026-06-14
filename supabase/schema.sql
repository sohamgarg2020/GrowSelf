-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  age INTEGER,
  sex TEXT CHECK (sex IN ('male', 'female', 'other')),
  weight_kg NUMERIC(5,2),
  height_cm NUMERIC(5,1),
  goal TEXT CHECK (goal IN ('build_muscle', 'lose_fat_build_muscle', 'general_fitness', 'increase_strength')),
  training_days_per_week INTEGER CHECK (training_days_per_week BETWEEN 1 AND 7),
  program_preference TEXT CHECK (program_preference IN ('structured', 'freestyle', 'hybrid')),
  coach_name TEXT DEFAULT 'Atlas',
  units_preference TEXT DEFAULT 'imperial' CHECK (units_preference IN ('metric', 'imperial')),
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises library
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  secondary_muscles TEXT[] DEFAULT '{}',
  equipment TEXT,
  form_tip TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programs
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  days_per_week INTEGER,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  program_days_json JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's active program
CREATE TABLE IF NOT EXISTS user_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  current_week INTEGER DEFAULT 1,
  current_day INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Workout sessions
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER DEFAULT 0,
  notes TEXT,
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  program_day_label TEXT,
  total_volume_kg NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual sets logged
CREATE TABLE IF NOT EXISTS workout_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  set_number INTEGER NOT NULL,
  weight_kg NUMERIC(6,2) NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  is_pr BOOLEAN DEFAULT FALSE,
  rpe NUMERIC(3,1) CHECK (rpe BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal records
CREATE TABLE IF NOT EXISTS personal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  weight_kg NUMERIC(6,2) NOT NULL,
  reps INTEGER NOT NULL,
  estimated_1rm NUMERIC(7,2),
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);

-- Body weight log
CREATE TABLE IF NOT EXISTS body_weight_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2) NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI coach conversations
CREATE TABLE IF NOT EXISTS coach_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily AI workout suggestions (cached)
CREATE TABLE IF NOT EXISTS daily_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  suggestion_date DATE NOT NULL DEFAULT CURRENT_DATE,
  workout_json JSONB NOT NULL DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, suggestion_date)
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_weight_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_suggestions ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Exercises RLS (public exercises readable by all, custom exercises only by creator)
CREATE POLICY "Anyone can view exercises" ON exercises FOR SELECT USING (
  is_custom = FALSE OR created_by_user_id = auth.uid()
);
CREATE POLICY "Users can insert custom exercises" ON exercises FOR INSERT WITH CHECK (
  is_custom = TRUE AND created_by_user_id = auth.uid()
);

-- Programs RLS (public)
CREATE POLICY "Anyone can view programs" ON programs FOR SELECT USING (TRUE);

-- User programs RLS
CREATE POLICY "Users manage own programs" ON user_programs FOR ALL USING (auth.uid() = user_id);

-- Workout sessions RLS
CREATE POLICY "Users manage own sessions" ON workout_sessions FOR ALL USING (auth.uid() = user_id);

-- Workout sets RLS
CREATE POLICY "Users manage own sets" ON workout_sets FOR ALL USING (
  session_id IN (SELECT id FROM workout_sessions WHERE user_id = auth.uid())
);

-- Personal records RLS
CREATE POLICY "Users manage own PRs" ON personal_records FOR ALL USING (auth.uid() = user_id);

-- Body weight log RLS
CREATE POLICY "Users manage own weight log" ON body_weight_log FOR ALL USING (auth.uid() = user_id);

-- Coach messages RLS
CREATE POLICY "Users manage own coach messages" ON coach_messages FOR ALL USING (auth.uid() = user_id);

-- Daily suggestions RLS
CREATE POLICY "Users manage own suggestions" ON daily_suggestions FOR ALL USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON workout_sessions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_sets_session ON workout_sets(session_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_user ON personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_messages_user ON coach_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_body_weight_user ON body_weight_log(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle ON exercises(muscle_group);
