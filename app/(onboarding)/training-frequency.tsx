import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store/authStore';
import { COLORS, SPACING, RADIUS, TRAINING_DAYS } from '../../lib/constants';
import Button from '../../components/ui/Button';
import OnboardingLayout from '../../components/ui/OnboardingLayout';

const DAY_LABELS: Record<number, string> = {
  3: 'The classic. Full recovery between sessions.',
  4: 'Upper/Lower or PPL variant. Solid balance.',
  5: 'High frequency. Great for hypertrophy.',
  6: 'PPL twice. Max volume, max gains.',
};

export default function TrainingFrequencyScreen() {
  const { user, setProfile } = useAuthStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!user) {
      Alert.alert('Session error', 'Please sign in again.');
      router.replace('/(auth)/splash');
      return;
    }
    if (!selected) { Alert.alert('Select frequency', 'How many days will you train?'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles').upsert({ id: user.id, training_days_per_week: selected }).select().single();
      if (error) { Alert.alert('Error', error.message); return; }
      setProfile(data as any);
      router.push('/(onboarding)/training-style');
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingLayout
      step={5}
      totalSteps={7}
      title="Training Frequency"
      subtitle="How many days per week can you commit to training?"
      onBack={() => router.back()}
    >
      <View style={styles.form}>
        <View style={styles.grid}>
          {TRAINING_DAYS.map((days) => (
            <TouchableOpacity
              key={days}
              onPress={() => setSelected(days)}
              style={[styles.dayCard, selected === days && styles.dayCardSelected]}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayNumber, selected === days && styles.dayNumberSelected]}>
                {days}
              </Text>
              <Text style={styles.dayLabel}>days/week</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selected && (
          <View style={styles.hint}>
            <Text style={styles.hintText}>{DAY_LABELS[selected]}</Text>
          </View>
        )}

        <Button label="NEXT" onPress={handleNext} loading={loading} style={styles.cta} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  form: { flex: 1, justifyContent: 'space-between', paddingBottom: SPACING.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  dayCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    gap: 4,
  },
  dayCardSelected: { borderColor: COLORS.accent, backgroundColor: `${COLORS.accent}15` },
  dayNumber: { fontSize: 48, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: -2 },
  dayNumberSelected: { color: COLORS.accent },
  dayLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  hint: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  hintText: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20 },
  cta: {},
});
