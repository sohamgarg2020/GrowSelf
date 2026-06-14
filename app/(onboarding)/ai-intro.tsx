import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store/authStore';
import { COLORS, SPACING, RADIUS } from '../../lib/constants';
import Button from '../../components/ui/Button';

const COACH_FEATURES = [
  'Learns from every workout you log',
  'Gives specific, data-driven advice',
  'Tracks your PRs and trends',
  'Never judges missed sessions',
];

export default function AIIntroScreen() {
  const { user, setProfile, profile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [coachName, setCoachName] = useState(profile?.coach_name || 'Atlas');
  const pulse = useRef(new Animated.Value(1)).current;
  const featureAnims = useRef(COACH_FEATURES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    Animated.stagger(
      200,
      featureAnims.map((anim) =>
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true, delay: 400 })
      )
    ).start();
  }, []);

  async function handleFinish() {
    if (!user) {
      Alert.alert('Session error', 'Please sign in again.');
      router.replace('/(auth)/splash');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, coach_name: coachName, onboarding_complete: true })
        .select().single();
      if (error) { Alert.alert('Error', error.message); return; }
      setProfile(data as any);
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>STEP 7 OF 7</Text>
        <Text style={styles.title}>Meet Your{'\n'}AI Coach</Text>

        <Animated.View style={[styles.coachOrb, { transform: [{ scale: pulse }] }]}>
          <Text style={styles.coachInitial}>{coachName[0]}</Text>
        </Animated.View>

        <Text style={styles.coachNameText}>
          <Text style={styles.coachNameAccent}>{coachName}</Text> is ready.
        </Text>

        <View style={styles.features}>
          {COACH_FEATURES.map((f, i) => (
            <Animated.View
              key={f}
              style={[styles.featureRow, { opacity: featureAnims[i], transform: [{ translateX: featureAnims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}
            >
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{f}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      <View style={styles.cta}>
        <Button label="START TRAINING" onPress={handleFinish} loading={loading} size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  content: { flex: 1, padding: SPACING.lg, alignItems: 'center' },
  step: { color: COLORS.accent, fontSize: 12, fontWeight: '700', letterSpacing: 2, marginTop: SPACING.xl, marginBottom: 8, alignSelf: 'flex-start' },
  title: { fontSize: 36, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: -1, alignSelf: 'flex-start', marginBottom: SPACING.xl },
  coachOrb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  coachInitial: { fontSize: 52, fontWeight: '900', color: '#FFFFFF' },
  coachNameText: { fontSize: 20, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  coachNameAccent: { color: COLORS.accent, fontWeight: '700' },
  features: { gap: 14, alignSelf: 'stretch' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent },
  featureText: { color: COLORS.textSecondary, fontSize: 15, flex: 1 },
  cta: { padding: SPACING.lg, paddingBottom: SPACING.xl },
});
