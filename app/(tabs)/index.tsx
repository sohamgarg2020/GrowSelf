import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../lib/store/authStore';
import { useWorkoutStore } from '../../lib/store/workoutStore';
import { supabase } from '../../lib/supabase';
import { COLORS, SPACING, RADIUS } from '../../lib/constants';
import { getGreeting, formatVolume, formatDuration, isSameDay, getThisWeekDates, formatDate } from '../../lib/utils';
import Card from '../../components/ui/Card';
import type { PersonalRecord } from '../../lib/types';

export default function HomeScreen() {
  const { profile, user } = useAuthStore();
  const { recentSessions, fetchRecentSessions } = useWorkoutStore();
  const [recentPR, setRecentPR] = useState<PersonalRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const weekDates = getThisWeekDates();

  async function loadData() {
    if (!user) return;
    await fetchRecentSessions(user.id);
    await loadRecentPR();
  }

  async function loadRecentPR() {
    if (!user) return;
    const { data } = await supabase
      .from('personal_records')
      .select('*, exercises(*)')
      .eq('user_id', user.id)
      .order('achieved_at', { ascending: false })
      .limit(1)
      .single();
    if (data) setRecentPR(data as any);
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [user]);

  useEffect(() => { loadData(); }, [user]);

  const lastSession = recentSessions[0];
  const units = profile?.units_preference ?? 'imperial';
  const firstName = profile?.name?.split(' ')[0] || '';

  const weekTrainedDays = weekDates.map((date) =>
    recentSessions.some((s) => isSameDay(new Date(s.date), date))
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.name}>{firstName}.</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.avatar}>
            <Text style={styles.avatarText}>{firstName[0] || 'G'}</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Plan */}
        <Card style={styles.todayCard}>
          <View style={styles.todayHeader}>
            <View style={styles.todayTag}>
              <Text style={styles.todayTagText}>TODAY'S PLAN</Text>
            </View>
          </View>
          <Text style={styles.todayTitle}>Ready to train?</Text>
          <Text style={styles.todayMuscles}>Start a workout when you're ready.</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push('/(tabs)/log')}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>START WORKOUT</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </Card>

        {/* Weekly Snapshot */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>THIS WEEK</Text>
          <Text style={styles.sectionSub}>{weekTrainedDays.filter(Boolean).length} of {profile?.training_days_per_week ?? 4} days</Text>
        </View>
        <Card style={styles.weekCard}>
          <View style={styles.weekRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <View key={i} style={styles.weekDay}>
                <View style={[styles.weekDot, weekTrainedDays[i] && styles.weekDotActive]} />
                <Text style={styles.weekDayLabel}>{day}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Last Workout */}
        {lastSession && (
          <>
            <Text style={styles.sectionTitle}>LAST WORKOUT</Text>
            <Card style={styles.lastWorkoutCard}>
              <View style={styles.lastWorkoutHeader}>
                <View>
                  <Text style={styles.lastWorkoutTitle}>{lastSession.program_day_label || 'Training Session'}</Text>
                  <Text style={styles.lastWorkoutDate}>{formatDate(lastSession.date)}</Text>
                </View>
                <View style={styles.lastWorkoutStats}>
                  <Text style={styles.statValue}>{formatDuration(lastSession.duration_minutes)}</Text>
                  <Text style={styles.statLabel}>Duration</Text>
                </View>
              </View>
              <View style={styles.volumeRow}>
                <View style={styles.volumeItem}>
                  <Text style={styles.volumeValue}>{formatVolume(lastSession.total_volume_kg, units)}</Text>
                  <Text style={styles.volumeLabel}>Total Volume</Text>
                </View>
                {recentPR && (
                  <View style={styles.prBadge}>
                    <Text style={styles.prIcon}>🏆</Text>
                    <Text style={styles.prText}>PR — {(recentPR as any).exercises?.name}</Text>
                  </View>
                )}
              </View>
            </Card>
          </>
        )}

        {/* AI Coach Placeholder */}
        <Card style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.insightOrb}>
              <Ionicons name="sparkles" size={14} color={COLORS.textMuted} />
            </View>
            <Text style={styles.insightLabel}>AI Coach</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>
          <Text style={styles.insightText}>
            AI-powered coaching insights will appear here once enabled.
          </Text>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/progress')}>
            <Ionicons name="trending-up" size={20} color={COLORS.accent} />
            <Text style={styles.quickActionText}>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/coach')}>
            <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.accent} />
            <Text style={styles.quickActionText}>Ask Coach</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  scroll: { padding: SPACING.lg, paddingBottom: 32 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xl },
  greeting: { fontSize: 16, color: COLORS.textSecondary, fontWeight: '500' },
  name: { fontSize: 32, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: -1 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },

  todayCard: { marginBottom: SPACING.lg },
  todayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  todayTag: { backgroundColor: `${COLORS.accent}20`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  todayTagText: { color: COLORS.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  todayTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  todayMuscles: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 16 },
  startButton: {
    backgroundColor: COLORS.accent, borderRadius: RADIUS.sm, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  startButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15, letterSpacing: 1 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 10 },
  sectionSub: { fontSize: 12, color: COLORS.textSecondary },

  weekCard: { marginBottom: SPACING.lg },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekDay: { alignItems: 'center', gap: 8 },
  weekDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.border },
  weekDotActive: { backgroundColor: COLORS.accent },
  weekDayLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },

  lastWorkoutCard: { marginBottom: SPACING.lg },
  lastWorkoutHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  lastWorkoutTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  lastWorkoutDate: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  lastWorkoutStats: { alignItems: 'flex-end' },
  statValue: { fontSize: 22, fontWeight: '800', color: COLORS.accent },
  statLabel: { fontSize: 12, color: COLORS.textMuted },
  volumeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  volumeItem: {},
  volumeValue: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  volumeLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  prBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: `${COLORS.warning}20`, paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.sm,
  },
  prIcon: { fontSize: 14 },
  prText: { color: COLORS.warning, fontSize: 12, fontWeight: '700' },

  insightCard: { marginBottom: SPACING.lg },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  insightOrb: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  insightLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, flex: 1 },
  comingSoonBadge: {
    backgroundColor: `${COLORS.accent}15`, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: `${COLORS.accent}30`,
  },
  comingSoonText: { color: COLORS.accent, fontSize: 11, fontWeight: '700' },
  insightText: { fontSize: 14, color: COLORS.textMuted, lineHeight: 20 },

  quickActions: { flexDirection: 'row', gap: 12 },
  quickAction: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: SPACING.md, alignItems: 'center', gap: 8,
  },
  quickActionText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
});
