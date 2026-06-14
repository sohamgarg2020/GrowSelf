export type Goal = 'build_muscle' | 'lose_fat_build_muscle' | 'general_fitness' | 'increase_strength';
export type Sex = 'male' | 'female' | 'other';
export type Units = 'metric' | 'imperial';
export type TrainingStyle = 'structured' | 'freestyle' | 'hybrid';
export type MessageRole = 'user' | 'assistant';

export interface Profile {
  id: string;
  name: string;
  age: number;
  sex: Sex;
  weight_kg: number;
  height_cm: number;
  goal: Goal;
  training_days_per_week: number;
  program_preference: TrainingStyle;
  coach_name: string;
  units_preference: Units;
  created_at: string;
  onboarding_complete: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  secondary_muscles: string[];
  equipment: string;
  form_tip: string;
  is_custom: boolean;
  created_by_user_id?: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  days_per_week: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  program_days_json: ProgramDay[];
}

export interface ProgramDay {
  day_number: number;
  label: string;
  muscle_groups: string[];
  exercises: ProgramExercise[];
}

export interface ProgramExercise {
  exercise_id?: string;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
}

export interface UserProgram {
  id: string;
  user_id: string;
  program_id: string;
  start_date: string;
  current_week: number;
  current_day: number;
  program?: Program;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  date: string;
  duration_minutes: number;
  notes?: string;
  mood?: number;
  program_day_label?: string;
  total_volume_kg: number;
  created_at: string;
  sets?: WorkoutSet[];
}

export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  is_pr: boolean;
  rpe?: number;
  created_at: string;
  exercise?: Exercise;
}

export interface PersonalRecord {
  id: string;
  user_id: string;
  exercise_id: string;
  weight_kg: number;
  reps: number;
  estimated_1rm: number;
  achieved_at: string;
  exercise?: Exercise;
}

export interface BodyWeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  logged_at: string;
}

export interface CoachMessage {
  id: string;
  user_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface DailySuggestion {
  id: string;
  user_id: string;
  suggestion_date: string;
  workout_json: WorkoutSuggestion;
  generated_at: string;
}

export interface WorkoutSuggestion {
  workout_title: string;
  muscle_groups: string[];
  program_day: string;
  suggested_exercises: SuggestedExercise[];
  estimated_duration_minutes: number;
  reasoning?: string;
}

export interface SuggestedExercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}

export interface ActiveWorkoutSet {
  setNumber: number;
  weight: string;
  reps: string;
  completed: boolean;
  isPR?: boolean;
}

export interface ActiveWorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  sets: ActiveWorkoutSet[];
  previousSets?: { weight: number; reps: number }[];
}
