# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm install          # Install dependencies
npx expo start       # Start dev server (Metro bundler)
npm run ios          # Start and open iOS Simulator
npm run android      # Start and open Android emulator
```

There is no test suite. TypeScript is checked implicitly by the Metro bundler at runtime; there is no standalone `tsc` check configured.

### Edge Functions (local)

```bash
supabase start                        # Start local Supabase stack (ports in supabase/config.toml)
supabase functions serve ai-chat      # Serve a single function locally
supabase secrets set ANTHROPIC_API_KEY=... # Set secret before deploying
supabase functions deploy ai-chat     # Deploy to remote project
```

## Architecture

GrowSelf is an Expo SDK 56 / React Native fitness tracking app. Routing is file-based via `expo-router` (Expo Router v4).

### Auth & navigation flow

`app/_layout.tsx` is the root — it initializes the Supabase auth listener, populates `authStore`, then renders a `<Stack>`. `app/index.tsx` is a pure redirect: unauthenticated → `/(auth)/splash`, authenticated + onboarding incomplete → `/(onboarding)/welcome`, otherwise → `/(tabs)`.

### Route groups

| Group | Purpose |
|---|---|
| `(auth)/` | Splash, Login, Signup |
| `(onboarding)/` | 7-step onboarding: welcome → basic-info → body-metrics → goal → training-frequency → training-style → ai-intro |
| `(tabs)/` | Main app: Home (`index`), Log, Progress, Coach, Profile |

### State management

Two Zustand stores (no persistence — state lives only in memory):

- **`lib/store/authStore.ts`** — `session`, `user`, `profile` (the `profiles` DB row). `fetchProfile()` loads it from Supabase. `setSession()` is called by the auth listener in `_layout.tsx`.
- **`lib/store/workoutStore.ts`** — `activeWorkout` (in-progress session state), `recentSessions`, `restTimer`. `saveWorkout(userId)` writes to Supabase and returns the new session ID. `fetchRecentSessions(userId)` loads recent history.

### Data layer

All database calls go through the Supabase JS client at `lib/supabase.ts`. Key tables:

- `profiles` — one row per user, written during onboarding, read via `authStore`
- `workout_sessions` + `workout_sets` — saved by `workoutStore.saveWorkout()`
- `personal_records` — written by PR detection logic in `log.tsx`; read on Progress and Home screens
- `body_weight_log` — written and read on the Progress → Body tab
- `coach_messages` — conversation history for the AI coach tab
- `daily_suggestions` — cached AI-generated workout plans (one per user per day)

The full schema and RLS policies are in `supabase/schema.sql`. Exercise and program seed data is in `supabase/seed.sql`.

### AI features

Two Supabase Edge Functions (Deno, in `supabase/functions/`):

- **`ai-chat/`** — proxies coach chat to `claude-sonnet-4-6`. Called from `app/(tabs)/coach.tsx` via `supabase.functions.invoke('ai-chat', ...)`. The system prompt is built in `lib/utils.ts → buildCoachSystemPrompt()`.
- **`daily-suggestion/`** — generates a daily workout plan. Called (or cached result fetched) from `app/(tabs)/index.tsx`.

Both require the `ANTHROPIC_API_KEY` secret set on the Supabase project. Without it the app still runs — the home screen falls back to a local `generateLocalInsight()` string and the coach tab shows an error alert.

### TypeScript types

All shared interfaces are in `lib/types/index.ts`. Key types: `Profile`, `WorkoutSession`, `WorkoutSet`, `PersonalRecord`, `Exercise`, `Program`, `CoachMessage`, `DailySuggestion`, `ActiveWorkoutExercise`. `ActiveWorkoutExercise` / `ActiveWorkoutSet` are ephemeral in-memory types used only by `workoutStore`; all persisted types use `_kg` or `_cm` suffixed fields.

### Local data (no DB needed)

- **`lib/exercises.ts`** — 150+ exercises with muscle groups, equipment, form tips. Exported as `EXERCISES` array plus `searchExercises()` and `getExercisesByMuscleGroup()` helpers.
- **`lib/programs.ts`** — built-in structured programs (PPL, 5/3/1, Upper/Lower, Full Body 3x) as `PROGRAMS` array.

### Design system

All styling is done with `StyleSheet.create` + constants from `lib/constants.ts`:

- `COLORS` — dark theme with `#FF4D00` accent, `#0A0A0A` background
- `SPACING` — `xs/sm/md/lg/xl/xxl` (4–48px)
- `RADIUS` — `sm/md/lg/xl/full`

NativeWind (Tailwind for RN) is installed but the primary pattern is `StyleSheet` + constants. Shared UI primitives live in `components/ui/`: `Button`, `Card`, `Input`, `Badge`, `OnboardingLayout`. The `components/` directory also has `coach/`, `progress/`, and `workout/` subdirectories for feature-specific components (currently empty, reserved for extraction from screen files).

### Progress screen internal tabs

`app/(tabs)/progress.tsx` renders three internal tabs controlled by a local `Tab = 'overview' | 'exercise' | 'body'` state (not router tabs). Overview shows session history and volume trends; Exercise shows PRs with per-exercise history charts (via `react-native-gifted-charts`); Body shows the body weight log with a weight trend chart.

### Units handling

All weights are stored internally in kg. The `profile.units_preference` field (`'metric' | 'imperial'`) drives display conversion. Helpers in `lib/utils.ts`: `kgToLbs()`, `lbsToKg()`, `formatWeight()`, `formatVolume()`. The 1RM estimate uses the Epley formula via `calculate1RM()` in `lib/utils.ts`.
