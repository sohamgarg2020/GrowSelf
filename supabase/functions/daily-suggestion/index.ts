import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, profile, recentWorkouts } = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const today = new Date().toISOString().split('T')[0];

    // Check if we already have a suggestion for today
    const { data: existing } = await supabase
      .from('daily_suggestions')
      .select('*')
      .eq('user_id', userId)
      .eq('suggestion_date', today)
      .single();

    if (existing) {
      return new Response(JSON.stringify({ suggestion: existing.workout_json }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const recentSummary = recentWorkouts?.map((w: any) =>
      `- ${w.date}: ${w.program_day_label || 'Training'} (${w.duration_minutes}min)`
    ).join('\n') ?? 'No recent workouts';

    const systemPrompt = `You are an intelligent workout programming agent. Generate a workout suggestion for today.

User Profile:
- Goal: ${profile.goal}
- Training days/week: ${profile.training_days_per_week}
- Program preference: ${profile.program_preference}
- Sex: ${profile.sex}

Recent workouts (last 14 days):
${recentSummary}

Rules:
- Avoid training the same muscle group on consecutive days
- Respect the user's training frequency
- If recent workouts show a PPL pattern, suggest the next logical day
- If no workouts recently, suggest an upper body or full body session
- Keep estimated duration realistic (45-75 minutes)

Respond with ONLY valid JSON in this exact format:
{
  "workout_title": "Push Day A",
  "muscle_groups": ["Chest", "Shoulders", "Triceps"],
  "program_day": "Push A",
  "suggested_exercises": [
    { "name": "Barbell Bench Press", "sets": 4, "reps": "6-8", "notes": "Focus on chest squeeze" },
    { "name": "Incline Dumbbell Press", "sets": 3, "reps": "8-12" },
    { "name": "Cable Flyes", "sets": 3, "reps": "12-15" },
    { "name": "Overhead Press", "sets": 3, "reps": "8-10" },
    { "name": "Lateral Raise", "sets": 4, "reps": "15-20" },
    { "name": "Tricep Pushdown", "sets": 3, "reps": "12-15" }
  ],
  "estimated_duration_minutes": 65,
  "reasoning": "Upper body push based on recent training pattern"
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: 'Generate today\'s workout suggestion.' }],
        system: systemPrompt,
      }),
    });

    const data = await response.json();
    const rawContent = data.content?.[0]?.text ?? '{}';

    let workoutJson;
    try {
      workoutJson = JSON.parse(rawContent);
    } catch {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      workoutJson = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        workout_title: 'Training Session',
        muscle_groups: ['Full Body'],
        program_day: 'Day 1',
        suggested_exercises: [],
        estimated_duration_minutes: 60,
      };
    }

    await supabase.from('daily_suggestions').upsert({
      user_id: userId,
      suggestion_date: today,
      workout_json: workoutJson,
    });

    return new Response(JSON.stringify({ suggestion: workoutJson }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
