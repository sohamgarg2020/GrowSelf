import { Profile } from './types';

export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs / 2.20462 * 10) / 10;
}

export function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round(((feet * 12 + inches) * 2.54) * 10) / 10;
}

export function formatWeight(kg: number, units: 'imperial' | 'metric'): string {
  if (units === 'imperial') return `${kgToLbs(kg)} lbs`;
  return `${kg} kg`;
}

export function formatHeight(cm: number, units: 'imperial' | 'metric'): string {
  if (units === 'imperial') return cmToFeetInches(cm);
  return `${cm} cm`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatVolume(kg: number, units: 'imperial' | 'metric'): string {
  if (units === 'imperial') {
    const lbs = Math.round(kgToLbs(kg));
    return `${lbs.toLocaleString()} lbs`;
  }
  return `${Math.round(kg).toLocaleString()} kg`;
}

export function getWeekDays(): string[] {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}

export function getThisWeekDates(): Date[] {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function getMuscleGroupColor(muscle: string): string {
  const colors: Record<string, string> = {
    Chest: '#EF4444',
    Back: '#3B82F6',
    Shoulders: '#8B5CF6',
    Biceps: '#F59E0B',
    Triceps: '#F97316',
    Quads: '#22C55E',
    Hamstrings: '#10B981',
    Glutes: '#EC4899',
    Calves: '#06B6D4',
    Abs: '#84CC16',
    Forearms: '#F59E0B',
    'Full Body': '#FF4D00',
  };
  return colors[muscle] ?? '#9CA3AF';
}

export function buildCoachSystemPrompt(profile: Profile, recentWorkoutSummary: string, recentPRs: string): string {
  const units = profile.units_preference;
  const weight = units === 'imperial' ? `${kgToLbs(profile.weight_kg)} lbs` : `${profile.weight_kg} kg`;
  const height = formatHeight(profile.height_cm, units);
  const goalLabels: Record<string, string> = {
    build_muscle: 'build muscle and maximize hypertrophy',
    lose_fat_build_muscle: 'lose fat while building muscle (body recomposition)',
    general_fitness: 'improve general fitness and health',
    increase_strength: 'increase maximal strength',
  };

  return `You are ${profile.coach_name}, an expert personal trainer and sports nutritionist. You are coaching ${profile.name}, a ${profile.age}-year-old ${profile.sex} who weighs ${weight} and is ${height} tall.

Their primary goal is to ${goalLabels[profile.goal] ?? profile.goal}.
They train ${profile.training_days_per_week} days per week.

Recent workout history (last 7 days):
${recentWorkoutSummary || 'No workouts logged recently.'}

Recent Personal Records:
${recentPRs || 'No PRs recorded yet.'}

COACHING GUIDELINES:
- Be motivating, direct, and knowledgeable
- Give specific, actionable advice — never be vague
- Reference the user's actual data when relevant
- Keep responses concise (2-5 sentences unless a detailed plan is needed)
- Use proper fitness terminology but explain it simply
- Never shame or guilt the user about missed workouts
- Prioritize evidence-based recommendations`;
}
