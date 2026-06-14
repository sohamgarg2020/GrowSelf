import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store/authStore';
import { COLORS, SPACING, RADIUS, GOALS } from '../../lib/constants';
import Button from '../../components/ui/Button';
import OnboardingLayout from '../../components/ui/OnboardingLayout';
import type { Goal } from '../../lib/types';

export default function GoalScreen() {
  const { user, setProfile } = useAuthStore();
  const [selected, setSelected] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!user) {
      Alert.alert('Session error', 'Please sign in again.');
      router.replace('/(auth)/splash');
      return;
    }
    if (!selected) { Alert.alert('Select a goal', 'Please choose your primary goal.'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles').upsert({ id: user.id, goal: selected }).select().single();
      if (error) { Alert.alert('Error', error.message); return; }
      setProfile(data as any);
      router.push('/(onboarding)/training-frequency');
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingLayout
      step={4}
      totalSteps={7}
      title="Your Goal"
      subtitle="This shapes everything — your program, your AI coaching, your targets."
      onBack={() => router.back()}
    >
      <View style={styles.form}>
        <View style={styles.options}>
          {GOALS.map((g) => (
            <TouchableOpacity
              key={g.key}
              onPress={() => setSelected(g.key as Goal)}
              style={[styles.option, selected === g.key && styles.optionSelected]}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, selected === g.key && styles.optionLabelSelected]}>
                    {g.label}
                  </Text>
                  <Text style={styles.optionDesc}>{g.description}</Text>
                </View>
                {selected === g.key && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.accent} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Button label="NEXT" onPress={handleNext} loading={loading} style={styles.cta} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  form: { flex: 1, justifyContent: 'space-between', paddingBottom: SPACING.xl },
  options: { gap: 12 },
  option: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  optionSelected: { borderColor: COLORS.accent, backgroundColor: `${COLORS.accent}15` },
  optionContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionText: { flex: 1 },
  optionLabel: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  optionLabelSelected: { color: COLORS.accent },
  optionDesc: { fontSize: 13, color: COLORS.textSecondary },
  cta: {},
});
