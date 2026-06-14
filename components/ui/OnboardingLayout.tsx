import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../lib/constants';

interface OnboardingLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
}

export default function OnboardingLayout({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onBack,
}: OnboardingLayoutProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={styles.progressRow}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[styles.progressDot, i < step ? styles.progressActive : null, i === step - 1 ? styles.progressCurrent : null]}
            />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.step}>STEP {step} OF {totalSteps}</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  back: { padding: 4 },
  progressRow: { flexDirection: 'row', gap: 6, flex: 1 },
  progressDot: { height: 3, flex: 1, backgroundColor: COLORS.border, borderRadius: 2 },
  progressActive: { backgroundColor: COLORS.accent },
  progressCurrent: { backgroundColor: COLORS.accent },
  content: { flexGrow: 1, padding: SPACING.lg },
  step: { color: COLORS.accent, fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 24, marginBottom: SPACING.lg },
  body: { flex: 1, marginTop: SPACING.lg },
});
