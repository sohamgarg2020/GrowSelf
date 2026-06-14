import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../lib/constants';

const COMING_FEATURES = [
  'Personalized workout recommendations',
  'Strength plateau advice',
  'Recovery and nutrition guidance',
  'Progress trend analysis',
];

export default function CoachScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>COACH</Text>
      </View>

      <View style={styles.center}>
        <View style={styles.orb}>
          <Ionicons name="sparkles" size={40} color={COLORS.textMuted} />
        </View>

        <Text style={styles.title}>AI Coach Coming Soon</Text>
        <Text style={styles.subtitle}>
          Your personal AI coach will analyze your workout history and give you tailored advice. Keep logging your workouts — the data will be ready when the coach launches.
        </Text>

        <View style={styles.featureList}>
          {COMING_FEATURES.map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  orb: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.sm, textAlign: 'center' },
  subtitle: {
    fontSize: 14, color: COLORS.textSecondary, textAlign: 'center',
    lineHeight: 22, marginBottom: SPACING.xl,
  },
  featureList: { alignSelf: 'stretch', gap: 14 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  featureText: { color: COLORS.textMuted, fontSize: 14, flex: 1 },
});
