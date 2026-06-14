import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store/authStore';
import { COLORS, SPACING, RADIUS, TRAINING_STYLES } from '../../lib/constants';
import Button from '../../components/ui/Button';
import OnboardingLayout from '../../components/ui/OnboardingLayout';
import type { TrainingStyle } from '../../lib/types';

export default function TrainingStyleScreen() {
  const { user, setProfile } = useAuthStore();
  const [selected, setSelected] = useState<TrainingStyle | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!user) {
      Alert.alert('Session error', 'Please sign in again.');
      router.replace('/(auth)/splash');
      return;
    }
    if (!selected) { Alert.alert('Select a style', 'How do you prefer to train?'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles').upsert({ id: user.id, program_preference: selected }).select().single();
      if (error) { Alert.alert('Error', error.message); return; }
      setProfile(data as any);
      router.push('/(onboarding)/ai-intro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingLayout
      step={6}
      totalSteps={7}
      title="Training Style"
      subtitle="Do you want to follow a set program, or log freely?"
      onBack={() => router.back()}
    >
      <View style={styles.form}>
        <View style={styles.options}>
          {TRAINING_STYLES.map((s) => (
            <TouchableOpacity
              key={s.key}
              onPress={() => setSelected(s.key as TrainingStyle)}
              style={[styles.option, selected === s.key && styles.optionSelected]}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, selected === s.key && styles.optionLabelSelected]}>
                    {s.label}
                  </Text>
                  <Text style={styles.optionDesc}>{s.description}</Text>
                </View>
                {selected === s.key && (
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
  optionDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  cta: {},
});
