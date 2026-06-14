import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store/authStore';
import { COLORS, SPACING, RADIUS } from '../../lib/constants';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import OnboardingLayout from '../../components/ui/OnboardingLayout';
import type { Sex } from '../../lib/types';

const SEX_OPTIONS: { key: Sex; label: string }[] = [
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
  { key: 'other', label: 'Other' },
];

export default function BasicInfoScreen() {
  const { user, setProfile, profile } = useAuthStore();
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [sex, setSex] = useState<Sex | null>(profile?.sex || null);
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!user) {
      Alert.alert('Session error', 'Please sign in again.');
      router.replace('/(auth)/splash');
      return;
    }
    if (!age || !sex) {
      Alert.alert('Missing info', 'Please fill out all fields.');
      return;
    }
    if (parseInt(age) < 13 || parseInt(age) > 99) {
      Alert.alert('Invalid age', 'Please enter a valid age.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, name: user.user_metadata?.name ?? '', age: parseInt(age), sex })
        .select()
        .single();
      if (error) { Alert.alert('Error', error.message); return; }
      setProfile(data as any);
      router.push('/(onboarding)/body-metrics');
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingLayout
      step={2}
      totalSteps={7}
      title="About You"
      subtitle="This helps us personalize your experience and calculations."
      onBack={() => router.back()}
    >
      <View style={styles.form}>
        <Input
          label="Age"
          placeholder="e.g. 25"
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          maxLength={2}
        />

        <View>
          <Text style={styles.label}>Biological Sex</Text>
          <Text style={styles.labelHint}>Used for calorie and strength calculations</Text>
          <View style={styles.sexRow}>
            {SEX_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => setSex(opt.key)}
                style={[styles.sexOption, sex === opt.key && styles.sexOptionSelected]}
              >
                <Text style={[styles.sexLabel, sex === opt.key && styles.sexLabelSelected]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button label="NEXT" onPress={handleNext} loading={loading} style={styles.cta} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  form: { gap: SPACING.lg },
  label: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '500', marginBottom: 4 },
  labelHint: { color: COLORS.textMuted, fontSize: 12, marginBottom: 10 },
  sexRow: { flexDirection: 'row', gap: 10 },
  sexOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  sexOptionSelected: { borderColor: COLORS.accent, backgroundColor: `${COLORS.accent}20` },
  sexLabel: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 15 },
  sexLabelSelected: { color: COLORS.accent },
  cta: { marginTop: SPACING.md },
});
