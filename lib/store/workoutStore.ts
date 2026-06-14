import { create } from 'zustand';
import { ActiveWorkoutExercise, WorkoutSession } from '../types';
import { supabase } from '../supabase';

interface WorkoutState {
  activeWorkout: {
    exercises: ActiveWorkoutExercise[];
    startTime: Date | null;
    notes: string;
    programDayLabel: string;
  } | null;
  recentSessions: WorkoutSession[];
  isLoading: boolean;
  restTimer: {
    isActive: boolean;
    seconds: number;
    duration: number;
  };

  startWorkout: (programDayLabel?: string) => void;
  endWorkout: () => void;
  addExercise: (exercise: ActiveWorkoutExercise) => void;
  removeExercise: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => void;
  completeSet: (exerciseId: string, setIndex: number) => void;
  addSet: (exerciseId: string) => void;
  setNotes: (notes: string) => void;
  startRestTimer: (duration: number) => void;
  stopRestTimer: () => void;
  tickRestTimer: () => void;
  fetchRecentSessions: (userId: string) => Promise<void>;
  saveWorkout: (userId: string) => Promise<string | null>;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  activeWorkout: null,
  recentSessions: [],
  isLoading: false,
  restTimer: { isActive: false, seconds: 0, duration: 0 },

  startWorkout: (programDayLabel = '') => {
    set({
      activeWorkout: {
        exercises: [],
        startTime: new Date(),
        notes: '',
        programDayLabel,
      },
    });
  },

  endWorkout: () => set({ activeWorkout: null }),

  addExercise: (exercise) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: [...activeWorkout.exercises, exercise],
      },
    });
  },

  removeExercise: (exerciseId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.filter((e) => e.exerciseId !== exerciseId),
      },
    });
  },

  updateSet: (exerciseId, setIndex, field, value) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    const exercises = activeWorkout.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const sets = ex.sets.map((s, i) =>
        i === setIndex ? { ...s, [field]: value } : s
      );
      return { ...ex, sets };
    });
    set({ activeWorkout: { ...activeWorkout, exercises } });
  },

  completeSet: (exerciseId, setIndex) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    const exercises = activeWorkout.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const sets = ex.sets.map((s, i) =>
        i === setIndex ? { ...s, completed: !s.completed } : s
      );
      return { ...ex, sets };
    });
    set({ activeWorkout: { ...activeWorkout, exercises } });
  },

  addSet: (exerciseId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    const exercises = activeWorkout.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const lastSet = ex.sets[ex.sets.length - 1];
      return {
        ...ex,
        sets: [
          ...ex.sets,
          {
            setNumber: ex.sets.length + 1,
            weight: lastSet?.weight ?? '',
            reps: lastSet?.reps ?? '',
            completed: false,
          },
        ],
      };
    });
    set({ activeWorkout: { ...activeWorkout, exercises } });
  },

  setNotes: (notes) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    set({ activeWorkout: { ...activeWorkout, notes } });
  },

  startRestTimer: (duration) => {
    set({ restTimer: { isActive: true, seconds: duration, duration } });
  },

  stopRestTimer: () => {
    set({ restTimer: { isActive: false, seconds: 0, duration: 0 } });
  },

  tickRestTimer: () => {
    const { restTimer } = get();
    if (!restTimer.isActive) return;
    if (restTimer.seconds <= 1) {
      set({ restTimer: { isActive: false, seconds: 0, duration: 0 } });
    } else {
      set({ restTimer: { ...restTimer, seconds: restTimer.seconds - 1 } });
    }
  },

  fetchRecentSessions: async (userId) => {
    set({ isLoading: true });
    const { data } = await supabase
      .from('workout_sessions')
      .select('*, workout_sets(*, exercises(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) set({ recentSessions: data as WorkoutSession[] });
    set({ isLoading: false });
  },

  saveWorkout: async (userId) => {
    const { activeWorkout } = get();
    if (!activeWorkout || !activeWorkout.startTime) return null;

    const durationMinutes = Math.round(
      (new Date().getTime() - activeWorkout.startTime.getTime()) / 60000
    );

    let totalVolumeKg = 0;
    for (const ex of activeWorkout.exercises) {
      for (const s of ex.sets) {
        if (s.completed) {
          totalVolumeKg += (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0);
        }
      }
    }

    const { data: session, error: sessionError } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        duration_minutes: durationMinutes,
        notes: activeWorkout.notes || null,
        program_day_label: activeWorkout.programDayLabel || null,
        total_volume_kg: totalVolumeKg,
      })
      .select()
      .single();

    if (sessionError || !session) return null;

    const setsToInsert = [];
    for (const ex of activeWorkout.exercises) {
      for (const s of ex.sets) {
        if (s.completed && s.weight && s.reps) {
          setsToInsert.push({
            session_id: session.id,
            exercise_id: ex.exerciseId,
            set_number: s.setNumber,
            weight_kg: parseFloat(s.weight),
            reps: parseInt(s.reps),
            is_pr: s.isPR ?? false,
          });
        }
      }
    }

    if (setsToInsert.length > 0) {
      await supabase.from('workout_sets').insert(setsToInsert);
    }

    return session.id;
  },
}));
