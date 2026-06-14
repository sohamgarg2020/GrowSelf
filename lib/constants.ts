export const COLORS = {
  accent: '#FF4D00',
  accentDim: '#CC3D00',
  accentLight: '#FF6B35',
  surface: '#1A1A1A',
  surface2: '#242424',
  surface3: '#2E2E2E',
  border: '#2A2A2A',
  borderLight: '#3A3A3A',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  bgPrimary: '#0A0A0A',
  bgSecondary: '#111111',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  heavy: 'System',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Forearms',
  'Abs',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Full Body',
] as const;

export const EQUIPMENT_TYPES = [
  'Barbell',
  'Dumbbell',
  'Cable',
  'Machine',
  'Bodyweight',
  'Kettlebell',
  'Band',
  'Smith Machine',
  'EZ Bar',
  'Trap Bar',
] as const;

export const GOALS = [
  { key: 'build_muscle', label: 'Build Muscle', description: 'Maximize hypertrophy and size' },
  { key: 'lose_fat_build_muscle', label: 'Lose Fat & Build Muscle', description: 'Body recomposition' },
  { key: 'general_fitness', label: 'Improve General Fitness', description: 'Health, endurance, and strength' },
  { key: 'increase_strength', label: 'Increase Strength', description: 'Focus on maximal strength' },
] as const;

export const TRAINING_DAYS = [3, 4, 5, 6] as const;

export const TRAINING_STYLES = [
  { key: 'structured', label: 'Follow a structured program', description: 'PPL, 5/3/1, Upper/Lower, etc.' },
  { key: 'freestyle', label: 'Log freely', description: 'Choose your own exercises each session' },
  { key: 'hybrid', label: 'Start with a program, freestyle when needed', description: 'Best of both worlds' },
] as const;

export const REST_TIMER_OPTIONS = [60, 90, 120, 180] as const;
