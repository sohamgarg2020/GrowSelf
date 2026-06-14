# GrowSelf — Setup Guide

## Prerequisites
- Node.js 20+
- Expo CLI: `npm install -g expo-cli`
- Supabase account (supabase.com)
- Anthropic API key
- iOS Simulator or physical device with Expo Go

## 1. Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Supabase Setup

### A. Create a Supabase project
Go to supabase.com → New Project

### B. Run the schema
In the Supabase SQL Editor, paste and run the contents of:
```
supabase/schema.sql
```

### C. Seed exercises and programs
In the Supabase SQL Editor, paste and run:
```
supabase/seed.sql
```

### D. Deploy Edge Functions
Install Supabase CLI: https://supabase.com/docs/guides/cli

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Set the Anthropic API key as a secret
supabase secrets set ANTHROPIC_API_KEY=your-anthropic-key

# Deploy functions
supabase functions deploy ai-chat
supabase functions deploy daily-suggestion
```

## 3. Run the App

```bash
npm install
npx expo start
```

Press `i` for iOS Simulator or scan QR code with Expo Go on device.

## App Architecture

```
app/
  _layout.tsx           # Root layout — auth listener
  index.tsx             # Redirect based on auth state
  (auth)/               # Splash, Login, Signup
  (onboarding)/         # 7-step onboarding flow
  (tabs)/               # Main app: Home, Log, Progress, Coach, Profile

components/
  ui/                   # Button, Card, Input, Badge, OnboardingLayout

lib/
  supabase.ts           # Supabase client
  constants.ts          # Colors, spacing, design tokens
  types/                # TypeScript interfaces
  utils.ts              # Helpers (1RM calc, unit conversion, etc.)
  exercises.ts          # 150+ exercise library (local)
  programs.ts           # Built-in programs (PPL, 5/3/1, Upper/Lower, Full Body)
  store/
    authStore.ts        # Zustand auth + profile state
    workoutStore.ts     # Zustand active workout state

supabase/
  schema.sql            # Full database schema + RLS policies
  seed.sql              # Exercise library + program seeding
  functions/
    ai-chat/            # Claude API proxy for coach chat
    daily-suggestion/   # AI workout suggestion generator
```

## Key Features

| Feature | Location |
|---------|----------|
| AI Coach Chat | `app/(tabs)/coach.tsx` → `supabase/functions/ai-chat/` |
| Daily AI Suggestions | `app/(tabs)/index.tsx` → `supabase/functions/daily-suggestion/` |
| Workout Logging | `app/(tabs)/log.tsx` + `lib/store/workoutStore.ts` |
| Progress Charts | `app/(tabs)/progress.tsx` |
| Exercise Library | `lib/exercises.ts` (150+ exercises, no DB needed) |
| Programs | `lib/programs.ts` (PPL, 5/3/1, Upper/Lower, Full Body 3x) |
| PR Detection | `lib/utils.ts` → `calculate1RM()` (Epley formula) |

## Deployment

Build for iOS: `npx expo build:ios` (requires EAS Build account)

Or use EAS:
```bash
npm install -g eas-cli
eas build --platform ios
```
