import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../lib/store/authStore';
import { COLORS, SPACING } from '../../lib/constants';
import Button from '../../components/ui/Button';
import OnboardingLayout from '../../components/ui/OnboardingLayout';

export default function WelcomeScreen() {
  const { profile, user } = useAuthStore();
  const firstName = (profile?.name || user?.user_metadata?.name)?.split(' ')[0] || 'there';

  return (
    <OnboardingLayout
      step={1}
      totalSteps={7}
      title={`Hey ${firstName}.`}
      subtitle="Let's build your profile. It takes 2 minutes and makes every feature personal."
    >
      <View style={styles.content}>
        <View style={styles.features}>
          {[
            { icon: '⚡', title: 'AI-powered coaching', desc: 'Your coach learns from every workout.' },
            { icon: '📊', title: 'Smart progress tracking', desc: 'Visualize gains with clean charts.' },
            { icon: '🏋️', title: '200+ exercises', desc: 'Full library with form tips.' },
          ].map((f) => (
            <View key={f.title} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <Button
          label="LET'S DO IT"
          onPress={() => router.push('/(onboarding)/basic-info')}
          style={styles.cta}
        />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'space-between', paddingBottom: SPACING.xl },
  features: { gap: SPACING.lg },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
  featureIcon: { fontSize: 28, width: 40 },
  featureText: { flex: 1, gap: 4 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  featureDesc: { fontSize: 14, color: COLORS.textSecondary },
  cta: { marginTop: SPACING.xl },
});
