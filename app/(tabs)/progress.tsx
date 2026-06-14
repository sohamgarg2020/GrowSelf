import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../lib/store/authStore';
import { supabase } from '../../lib/supabase';
import { COLORS, SPACING, RADIUS } from '../../lib/constants';
import { formatDate, formatVolume, kgToLbs } from '../../lib/utils';
import Card from '../../components/ui/Card';
import type { WorkoutSession, PersonalRecord, BodyWeightLog } from '../../lib/types';

type Tab = 'overview' | 'exercise' | 'body';

export default function ProgressScreen() {
  const { user, profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [prs, setPRs] = useState<PersonalRecord[]>([]);
  const [bodyLog, setBodyLog] = useState<BodyWeightLog[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<PersonalRecord | null>(null);
  const [newWeight, setNewWeight] = useState('');
  const [loading, setLoading] = useState(true);

  const units = profile?.units_preference ?? 'imperial';

  useEffect(() => { loadData(); }, [user]);

  async function loadData() {
    if (!user) return;
    setLoading(true);

    const [{ data: sessData }, { data: prData }, { data: bodyData }] = await Promise.all([
      supabase.from('workout_sessions').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(50),
      supabase.from('personal_records').select('*, exercises(*)').eq('user_id', user.id).order('achieved_at', { ascending: false }),
      supabase.from('body_weight_log').select('*').eq('user_id', user.id).order('logged_at', { ascending: false }).limit(60),
    ]);

    if (sessData) setSessions(sessData as WorkoutSession[]);
    if (prData) setPRs(prData as any[]);
    if (bodyData) setBodyLog(bodyData as BodyWeightLog[]);
    setLoading(false);
  }

  async function logBodyWeight() {
    if (!user || !newWeight) return;
    const wKg = units === 'imperial' ? parseFloat(newWeight) / 2.20462 : parseFloat(newWeight);
    await supabase.from('body_weight_log').insert({ user_id: user.id, weight_kg: wKg });
    setNewWeight('');
    loadData();
  }

  // Overview stats
  const now = new Date();
  const thisMonth = sessions.filter((s) => {
    const d = new Date(s.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const lastMonth = sessions.filter((s) => {
    const d = new Date(s.date);
    const lm = new Date(now); lm.setMonth(lm.getMonth() - 1);
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
  });
  const thisMonthVolume = thisMonth.reduce((s, sess) => s + sess.total_volume_kg, 0);
  const lastMonthVolume = lastMonth.reduce((s, sess) => s + sess.total_volume_kg, 0);
  const volumePct = lastMonthVolume > 0 ? Math.round(((thisMonthVolume - lastMonthVolume) / lastMonthVolume) * 100) : 0;

  const muscleCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    const label = s.program_day_label ?? 'Other';
    muscleCounts[label] = (muscleCounts[label] || 0) + 1;
  });
  const topMuscle = Object.entries(muscleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const filteredPRs = prs.filter((pr) =>
    (pr as any).exercises?.name?.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PROGRESS</Text>
        <View style={styles.tabs}>
          {(['overview', 'exercise', 'body'] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setActiveTab(t)}
              style={[styles.tab, activeTab === t && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                {t === 'overview' ? 'Overview' : t === 'exercise' ? 'Exercise' : 'Body'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <View style={styles.section}>
            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{thisMonth.length}</Text>
                <Text style={styles.statLabel}>Workouts{'\n'}This Month</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={[styles.statValue, { color: volumePct >= 0 ? COLORS.success : COLORS.error }]}>
                  {volumePct >= 0 ? '+' : ''}{volumePct}%
                </Text>
                <Text style={styles.statLabel}>Volume vs{'\n'}Last Month</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{prs.length}</Text>
                <Text style={styles.statLabel}>All-Time{'\n'}PRs Set</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={[styles.statValue, { fontSize: 16 }]}>{topMuscle}</Text>
                <Text style={styles.statLabel}>Most Trained{'\n'}Group</Text>
              </Card>
            </View>

            <Text style={styles.sectionTitle}>MONTHLY VOLUME</Text>
            {[thisMonth, lastMonth].map((monthSessions, mi) => {
              const vol = monthSessions.reduce((s, sess) => s + sess.total_volume_kg, 0);
              const label = mi === 0 ? 'This Month' : 'Last Month';
              const max = Math.max(thisMonthVolume, lastMonthVolume) || 1;
              return (
                <View key={mi} style={styles.volumeBar}>
                  <Text style={styles.volumeBarLabel}>{label}</Text>
                  <View style={styles.volumeBarTrack}>
                    <View style={[styles.volumeBarFill, { width: `${(vol / max) * 100}%`, backgroundColor: mi === 0 ? COLORS.accent : '#2E2E2E' }]} />
                  </View>
                  <Text style={styles.volumeBarValue}>{formatVolume(vol, units)}</Text>
                </View>
              );
            })}

            <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>RECENT PERSONAL RECORDS</Text>
            {prs.slice(0, 5).map((pr) => (
              <Card key={pr.id} style={styles.prCard}>
                <Text style={styles.prExercise}>{(pr as any).exercises?.name ?? 'Unknown'}</Text>
                <View style={styles.prStats}>
                  <View style={styles.prStat}>
                    <Text style={styles.prStatValue}>
                      {units === 'imperial' ? `${Math.round(kgToLbs(pr.weight_kg))} lbs` : `${pr.weight_kg} kg`}
                    </Text>
                    <Text style={styles.prStatLabel}>Weight</Text>
                  </View>
                  <View style={styles.prStat}>
                    <Text style={styles.prStatValue}>{pr.reps}</Text>
                    <Text style={styles.prStatLabel}>Reps</Text>
                  </View>
                  <View style={styles.prStat}>
                    <Text style={styles.prStatValue}>
                      {units === 'imperial' ? `${Math.round(kgToLbs(pr.estimated_1rm))}` : `${Math.round(pr.estimated_1rm)}`}
                    </Text>
                    <Text style={styles.prStatLabel}>Est. 1RM</Text>
                  </View>
                </View>
                <Text style={styles.prDate}>{formatDate(pr.achieved_at)}</Text>
              </Card>
            ))}
            {prs.length === 0 && <Text style={styles.emptyText}>Log workouts to start tracking PRs.</Text>}
          </View>
        )}

        {activeTab === 'exercise' && (
          <View style={styles.section}>
            <TextInput
              style={styles.searchInput}
              value={exerciseSearch}
              onChangeText={setExerciseSearch}
              placeholder="Search exercises..."
              placeholderTextColor={COLORS.textMuted}
            />

            {exerciseSearch ? (
              filteredPRs.length > 0 ? (
                filteredPRs.map((pr) => (
                  <TouchableOpacity
                    key={pr.id}
                    onPress={() => setSelectedExercise(pr)}
                    style={styles.exerciseListItem}
                  >
                    <View>
                      <Text style={styles.exerciseListName}>{(pr as any).exercises?.name}</Text>
                      <Text style={styles.exerciseListMeta}>
                        PR: {units === 'imperial' ? `${Math.round(kgToLbs(pr.weight_kg))} lbs` : `${pr.weight_kg} kg`} × {pr.reps}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>No exercises found. Log workouts to see data.</Text>
              )
            ) : (
              <>
                <Text style={styles.sectionTitle}>YOUR PERSONAL RECORDS</Text>
                {prs.map((pr) => (
                  <Card key={pr.id} style={styles.prCard}>
                    <View style={styles.prHeader}>
                      <Text style={styles.prExercise}>{(pr as any).exercises?.name}</Text>
                      <View style={styles.prBadge}>
                        <Text style={styles.prBadgeText}>PR</Text>
                      </View>
                    </View>
                    <View style={styles.prStats}>
                      <View style={styles.prStat}>
                        <Text style={styles.prStatValue}>
                          {units === 'imperial' ? `${Math.round(kgToLbs(pr.weight_kg))}` : `${pr.weight_kg}`}
                        </Text>
                        <Text style={styles.prStatLabel}>{units === 'imperial' ? 'lbs' : 'kg'}</Text>
                      </View>
                      <View style={styles.prStat}>
                        <Text style={styles.prStatValue}>{pr.reps}</Text>
                        <Text style={styles.prStatLabel}>Reps</Text>
                      </View>
                      <View style={styles.prStat}>
                        <Text style={styles.prStatValue}>
                          {units === 'imperial' ? `${Math.round(kgToLbs(pr.estimated_1rm))}` : `${Math.round(pr.estimated_1rm)}`}
                        </Text>
                        <Text style={styles.prStatLabel}>Est. 1RM</Text>
                      </View>
                    </View>
                    <Text style={styles.prDate}>{formatDate(pr.achieved_at)}</Text>
                  </Card>
                ))}
                {prs.length === 0 && <Text style={styles.emptyText}>No PRs logged yet. Complete workouts to track progress.</Text>}
              </>
            )}
          </View>
        )}

        {activeTab === 'body' && (
          <View style={styles.section}>
            <Card style={styles.logWeightCard}>
              <Text style={styles.logWeightTitle}>Log Today's Weight</Text>
              <View style={styles.logWeightRow}>
                <TextInput
                  style={styles.weightInput}
                  value={newWeight}
                  onChangeText={setNewWeight}
                  placeholder={units === 'imperial' ? 'lbs' : 'kg'}
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="decimal-pad"
                />
                <TouchableOpacity style={styles.logWeightBtn} onPress={logBodyWeight}>
                  <Text style={styles.logWeightBtnText}>Log</Text>
                </TouchableOpacity>
              </View>
            </Card>

            {bodyLog.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>WEIGHT HISTORY</Text>
                {bodyLog.slice(0, 20).map((entry) => {
                  const displayWeight = units === 'imperial' ? `${Math.round(kgToLbs(entry.weight_kg) * 10) / 10} lbs` : `${entry.weight_kg} kg`;
                  return (
                    <View key={entry.id} style={styles.weightEntry}>
                      <Text style={styles.weightEntryDate}>{formatDate(entry.logged_at)}</Text>
                      <Text style={styles.weightEntryValue}>{displayWeight}</Text>
                    </View>
                  );
                })}
              </>
            )}

            {bodyLog.length === 0 && (
              <View style={styles.emptyBody}>
                <Text style={styles.emptyBodyTitle}>Track Your Weight</Text>
                <Text style={styles.emptyBodyText}>Log your weight regularly to see your body composition journey.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  title: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 2, marginBottom: SPACING.md },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: 4, marginBottom: SPACING.md },
  tab: { flex: 1, paddingVertical: 8, borderRadius: RADIUS.sm - 2, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.accent },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#FFFFFF' },

  scroll: { padding: SPACING.lg, paddingTop: 0, paddingBottom: 32 },
  section: { gap: SPACING.sm },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: SPACING.lg },
  statCard: { width: '47%', alignItems: 'center', paddingVertical: SPACING.lg },
  statValue: { fontSize: 28, fontWeight: '900', color: COLORS.accent, letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4, lineHeight: 16 },

  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5, marginTop: SPACING.sm },

  volumeBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  volumeBarLabel: { width: 80, fontSize: 13, color: COLORS.textSecondary },
  volumeBarTrack: { flex: 1, height: 8, backgroundColor: COLORS.surface2, borderRadius: 4, overflow: 'hidden' },
  volumeBarFill: { height: '100%', borderRadius: 4 },
  volumeBarValue: { width: 70, fontSize: 12, color: COLORS.textSecondary, textAlign: 'right' },

  prCard: { marginBottom: 8 },
  prHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  prExercise: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  prBadge: { backgroundColor: `${COLORS.accent}20`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  prBadgeText: { color: COLORS.accent, fontSize: 11, fontWeight: '700' },
  prStats: { flexDirection: 'row', gap: SPACING.lg },
  prStat: { alignItems: 'center' },
  prStatValue: { fontSize: 18, fontWeight: '800', color: COLORS.accent },
  prStatLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  prDate: { fontSize: 12, color: COLORS.textMuted, marginTop: 8 },

  emptyText: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center', paddingVertical: SPACING.xl },

  searchInput: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, color: COLORS.textPrimary, fontSize: 16, marginBottom: SPACING.sm,
  },
  exerciseListItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, marginBottom: 8,
  },
  exerciseListName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  exerciseListMeta: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },

  logWeightCard: { marginBottom: SPACING.lg },
  logWeightTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },
  logWeightRow: { flexDirection: 'row', gap: 12 },
  weightInput: {
    flex: 1, backgroundColor: COLORS.surface2, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.border, padding: SPACING.md, color: COLORS.textPrimary, fontSize: 20,
    fontWeight: '700', textAlign: 'center',
  },
  logWeightBtn: { backgroundColor: COLORS.accent, borderRadius: RADIUS.md, paddingHorizontal: SPACING.lg, justifyContent: 'center' },
  logWeightBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },

  weightEntry: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  weightEntryDate: { color: COLORS.textSecondary, fontSize: 14 },
  weightEntryValue: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' },

  emptyBody: { paddingVertical: SPACING.xl, alignItems: 'center', gap: 8 },
  emptyBodyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  emptyBodyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
});
