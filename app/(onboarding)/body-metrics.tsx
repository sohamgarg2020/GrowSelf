import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store/authStore';
import { COLORS, SPACING, RADIUS } from '../../lib/constants';
import { lbsToKg, feetInchesToCm } from '../../lib/utils';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import OnboardingLayout from '../../components/ui/OnboardingLayout';

export default function BodyMetricsScreen() {
  const { user, setProfile } = useAuthStore();
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [weight, setWeight] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!user) {
      Alert.alert('Session error', 'Please sign in again.');
      router.replace('/(auth)/splash');
      return;
    }
    if (!weight) { Alert.alert('Missing info', 'Please enter your weight.'); return; }
    const weightKg = units === 'imperial' ? lbsToKg(parseFloat(weight)) : parseFloat(weight);
    let heightCmVal: number;
    if (units === 'imperial') {
      if (!heightFt) { Alert.alert('Missing info', 'Please enter your height.'); return; }
      heightCmVal = feetInchesToCm(parseInt(heightFt), parseInt(heightIn || '0'));
    } else {
      if (!heightCm) { Alert.alert('Missing info', 'Please enter your height.'); return; }
      heightCmVal = parseFloat(heightCm);
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, weight_kg: weightKg, height_cm: heightCmVal, units_preference: units })
        .select().single();
      if (error) { Alert.alert('Error', error.message); return; }
      setProfile(data as any);
      router.push('/(onboarding)/goal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingLayout
      step={3}
      totalSteps={7}
      title="Body Metrics"
      subtitle="Your starting point. We'll track your progress from here."
      onBack={() => router.back()}
    >
      <View style={styles.form}>
        <View style={styles.unitsToggle}>
          {(['imperial', 'metric'] as const).map((u) => (
            <TouchableOpacity
              key={u}
              onPress={() => setUnits(u)}
              style={[styles.unitOption, units === u && styles.unitOptionSelected]}
            >
              <Text style={[styles.unitLabel, units === u && styles.unitLabelSelected]}>
                {u === 'imperial' ? 'lbs / ft' : 'kg / cm'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label={`Current Weight (${units === 'imperial' ? 'lbs' : 'kg'})`}
          placeholder={units === 'imperial' ? 'e.g. 185' : 'e.g. 84'}
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
        />

        {units === 'imperial' ? (
          <View>
            <Text style={styles.label}>Height</Text>
            <View style={styles.heightRow}>
              <Input
                placeholder="ft"
                value={heightFt}
                onChangeText={setHeightFt}
                keyboardType="number-pad"
                maxLength={1}
                containerStyle={styles.heightInput}
              />
              <Input
                placeholder="in"
                value={heightIn}
                onChangeText={setHeightIn}
                keyboardType="number-pad"
                maxLength={2}
                containerStyle={styles.heightInput}
              />
            </View>
          </View>
        ) : (
          <Input
            label="Height (cm)"
            placeholder="e.g. 178"
            value={heightCm}
            onChangeText={setHeightCm}
            keyboardType="decimal-pad"
          />
        )}

        <Button label="NEXT" onPress={handleNext} loading={loading} style={styles.cta} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  form: { gap: SPACING.lg },
  unitsToggle: { flexDirection: 'row', gap: 8, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 4 },
  unitOption: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.sm, alignItems: 'center' },
  unitOptionSelected: { backgroundColor: COLORS.accent },
  unitLabel: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 14 },
  unitLabelSelected: { color: '#FFFFFF' },
  label: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '500', marginBottom: 6 },
  heightRow: { flexDirection: 'row', gap: 12 },
  heightInput: { flex: 1 },
  cta: { marginTop: SPACING.md },
});
