import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

console.log('[Supabase] URL:', supabaseUrl || '(not set — check EXPO_PUBLIC_SUPABASE_URL in .env)');
console.log('[Supabase] Anon key:', supabaseAnonKey ? `${supabaseAnonKey.slice(0, 20)}... (set)` : '(not set — check EXPO_PUBLIC_SUPABASE_ANON_KEY in .env)');

// Connection test — remove once simulator DNS issues are resolved
if (supabaseUrl) {
  fetch(supabaseUrl)
    .then(r => console.log('[NetTest] Supabase URL reachable, HTTP status:', r.status))
    .catch(e => console.error('[NetTest] Supabase URL unreachable:', e.message));
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    // undefined lets React Native use its native XHR-backed fetch instead of cross-fetch,
    // which avoids intermittent DNS failures in the iOS Simulator.
    fetch: undefined as unknown as typeof fetch,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          age: number;
          sex: string;
          weight_kg: number;
          height_cm: number;
          goal: string;
          training_days_per_week: number;
          program_preference: string;
          coach_name: string;
          units_preference: string;
          created_at: string;
          onboarding_complete: boolean;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          muscle_group: string;
          secondary_muscles: string[];
          equipment: string;
          form_tip: string;
          is_custom: boolean;
          created_by_user_id: string | null;
        };
        Insert: Omit<Database['public']['Tables']['exercises']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['exercises']['Insert']>;
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          duration_minutes: number;
          notes: string | null;
          mood: number | null;
          program_day_label: string | null;
          total_volume_kg: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['workout_sessions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['workout_sessions']['Insert']>;
      };
      workout_sets: {
        Row: {
          id: string;
          session_id: string;
          exercise_id: string;
          set_number: number;
          weight_kg: number;
          reps: number;
          is_pr: boolean;
          rpe: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['workout_sets']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['workout_sets']['Insert']>;
      };
      personal_records: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          weight_kg: number;
          reps: number;
          estimated_1rm: number;
          achieved_at: string;
        };
        Insert: Omit<Database['public']['Tables']['personal_records']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['personal_records']['Insert']>;
      };
      body_weight_log: {
        Row: {
          id: string;
          user_id: string;
          weight_kg: number;
          logged_at: string;
        };
        Insert: Omit<Database['public']['Tables']['body_weight_log']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['body_weight_log']['Insert']>;
      };
      coach_messages: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          content: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['coach_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['coach_messages']['Insert']>;
      };
      daily_suggestions: {
        Row: {
          id: string;
          user_id: string;
          suggestion_date: string;
          workout_json: object;
          generated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['daily_suggestions']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['daily_suggestions']['Insert']>;
      };
    };
  };
};
