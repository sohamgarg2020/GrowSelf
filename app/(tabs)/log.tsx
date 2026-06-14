import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
  TextInput, FlatList, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../lib/store/authStore';
import { useWorkoutStore } from '../../lib/store/workoutStore';
import { COLORS, SPACING, RADIUS, MUSCLE_GROUPS, REST_TIMER_OPTIONS } from '../../lib/constants';
import { EXERCISES, searchExercises, getExercisesByMuscleGroup } from '../../lib/exercises';
import { formatDuration } from '../../lib/utils';
import type { ActiveWorkoutExercise } from '../../lib/types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

type ScreenMode = 'start' | 'active' | 'finish';

export default function LogScreen() {
  const { profile, user } = useAuthStore();
  const {
    activeWorkout, recentSessions, startWorkout, endWorkout, addExercise, removeExercise,
    updateSet, completeSet, addSet, setNotes, restTimer, startRestTimer, stopRestTimer, tickRestTimer,
    saveWorkout, fetchRecentSessions,
  } = useWorkoutStore();

  const [mode, setMode] = useState<ScreenMode>(activeWorkout ? 'active' : 'start');
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [elapsed, setElapsed] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showRestModal, setShowRestModal] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeWorkout && mode === 'active') {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeWorkout, mode]);

  useEffect(() => {
    if (restTimer.isActive) {
      timerRef.current = setInterval(() => tickRestTimer(), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [restTimer.isActive]);

  function handleStartEmpty() {
    startWorkout();
    setMode('active');
    setElapsed(0);
  }

  async function handleFinish() {
    if (!activeWorkout || !activeWorkout.exercises.length) {
      Alert.alert('No exercises', 'Add at least one exercise before finishing.');
      return;
    }
    setMode('finish');
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    const sessionId = await saveWorkout(user.id);
    setSaving(false);
    if (sessionId) {
      endWorkout();
      await fetchRecentSessions(user.id);
      setMode('start');
      Alert.alert('Workout Saved!', 'Great work. Your session has been logged.');
    } else {
      Alert.alert('Error', 'Could not save workout. Please try again.');
    }
  }

  function handleDiscard() {
    Alert.alert('Discard Workout?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => { endWorkout(); setMode('start'); } },
    ]);
  }

  function getFilteredExercises() {
    const baseList = exerciseSearch ? searchExercises(exerciseSearch) : (selectedMuscle === 'All' ? EXERCISES : getExercisesByMuscleGroup(selectedMuscle));
    return baseList;
  }

  function handleAddExercise(exName: string, musclGroup: string) {
    const newEx: ActiveWorkoutExercise = {
      exerciseId: `${Date.now()}_${exName}`,
      exerciseName: exName,
      muscleGroup: musclGroup,
      sets: [{ setNumber: 1, weight: '', reps: '', completed: false }],
    };
    addExercise(newEx);
    setShowExercisePicker(false);
    setExerciseSearch('');
    setSelectedMuscle('All');
  }

  const totalVolume = activeWorkout?.exercises.reduce((sum, ex) =>
    sum + ex.sets.reduce((s, set) =>
      set.completed ? s + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0) : s, 0), 0) ?? 0;

  const completedSets = activeWorkout?.exercises.reduce((sum, ex) =>
    sum + ex.sets.filter((s) => s.completed).length, 0) ?? 0;

  if (mode === 'start') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.screenTitle}>LOG WORKOUT</Text>

          <View style={styles.startOptions}>
            <TouchableOpacity style={styles.startCard} onPress={handleStartEmpty} activeOpacity={0.8}>
              <View style={[styles.startIcon, { backgroundColor: `${COLORS.accent}20` }]}>
                <Ionicons name="add" size={28} color={COLORS.accent} />
              </View>
              <Text style={styles.startCardTitle}>Start Empty</Text>
              <Text style={styles.startCardDesc}>Choose your own exercises</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.startCard}
              onPress={() => { startWorkout('PPL Push Day'); setMode('active'); setElapsed(0); }}
              activeOpacity={0.8}
            >
              <View style={[styles.startIcon, { backgroundColor: `${COLORS.info}20` }]}>
                <Ionicons name="calendar" size={28} color={COLORS.info} />
              </View>
              <Text style={styles.startCardTitle}>Today's Plan</Text>
              <Text style={styles.startCardDesc}>AI-suggested session</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Sessions */}
          <Text style={styles.recentTitle}>RECENT SESSIONS</Text>
          <View style={styles.recentList}>
            {recentSessions.slice(0, 3).map((s) => (
              <Card key={s.id} style={styles.recentCard}>
                <Text style={styles.recentCardLabel}>{s.program_day_label || 'Training Session'}</Text>
                <Text style={styles.recentCardDate}>{s.date} · {s.duration_minutes}min</Text>
              </Card>
            ))}
            {recentSessions.length === 0 && (
              <Text style={styles.emptyText}>No recent sessions. Time to train.</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (mode === 'finish') {
    const durationMin = Math.round(elapsed / 60);
    const units = profile?.units_preference ?? 'imperial';
    const displayVolume = units === 'imperial' ? `${Math.round(totalVolume * 2.20462).toLocaleString()} lbs` : `${Math.round(totalVolume).toLocaleString()} kg`;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.finishTitle}>WORKOUT COMPLETE</Text>
          <View style={styles.finishStats}>
            <View style={styles.finishStat}>
              <Text style={styles.finishStatValue}>{formatDuration(durationMin)}</Text>
              <Text style={styles.finishStatLabel}>Duration</Text>
            </View>
            <View style={styles.finishDivider} />
            <View style={styles.finishStat}>
              <Text style={styles.finishStatValue}>{completedSets}</Text>
              <Text style={styles.finishStatLabel}>Sets Done</Text>
            </View>
            <View style={styles.finishDivider} />
            <View style={styles.finishStat}>
              <Text style={styles.finishStatValue}>{displayVolume}</Text>
              <Text style={styles.finishStatLabel}>Volume</Text>
            </View>
          </View>

          <View style={styles.finishMessage}>
            <Text style={styles.finishMessageText}>
              {completedSets >= 20 ? "Incredible session. You pushed through all of it." :
               completedSets >= 10 ? "Solid work. Another session in the bank." :
               "Every rep counts. Keep building the habit."}
            </Text>
          </View>

          <View style={styles.finishActions}>
            <Button label="SAVE WORKOUT" onPress={handleSave} loading={saving} />
            <Button label="Discard" onPress={handleDiscard} variant="ghost" fullWidth={false} style={styles.discardBtn} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Active Workout Header */}
      <View style={styles.activeHeader}>
        <View>
          <Text style={styles.activeTitle}>{activeWorkout?.programDayLabel || 'Training Session'}</Text>
          <Text style={styles.activeTimer}>{formatDuration(Math.round(elapsed / 60))} · {completedSets} sets</Text>
        </View>
        <View style={styles.activeHeaderActions}>
          <TouchableOpacity onPress={handleFinish} style={styles.finishBtn}>
            <Text style={styles.finishBtnText}>FINISH</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDiscard} style={styles.discardIconBtn}>
            <Ionicons name="close" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rest Timer Bar */}
      {restTimer.isActive && (
        <View style={styles.restBar}>
          <Ionicons name="timer-outline" size={16} color={COLORS.accent} />
          <Text style={styles.restText}>Rest: {restTimer.seconds}s</Text>
          <TouchableOpacity onPress={stopRestTimer}>
            <Text style={styles.restSkip}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.activeScroll} showsVerticalScrollIndicator={false}>
        {activeWorkout?.exercises.map((exercise) => (
          <Card key={exercise.exerciseId} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                <View style={styles.muscleBadge}>
                  <Text style={styles.muscleBadgeText}>{exercise.muscleGroup}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeExercise(exercise.exerciseId)}>
                <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.setHeader}>
              <Text style={[styles.setHeaderText, { width: 32 }]}>SET</Text>
              <Text style={[styles.setHeaderText, { flex: 1 }]}>PREVIOUS</Text>
              <Text style={[styles.setHeaderText, { width: 80 }]}>WEIGHT</Text>
              <Text style={[styles.setHeaderText, { width: 60 }]}>REPS</Text>
              <Text style={[styles.setHeaderText, { width: 32 }]}></Text>
            </View>

            {exercise.sets.map((set, si) => (
              <View key={si} style={[styles.setRow, set.completed && styles.setRowCompleted]}>
                <Text style={styles.setNumber}>{set.setNumber}</Text>
                <Text style={styles.setPrevious}>
                  {exercise.previousSets?.[si] ? `${exercise.previousSets[si].weight}×${exercise.previousSets[si].reps}` : '—'}
                </Text>
                <TextInput
                  style={[styles.setInput, { width: 72 }]}
                  value={set.weight}
                  onChangeText={(v) => updateSet(exercise.exerciseId, si, 'weight', v)}
                  keyboardType="decimal-pad"
                  placeholder="lbs"
                  placeholderTextColor={COLORS.textMuted}
                  editable={!set.completed}
                />
                <TextInput
                  style={[styles.setInput, { width: 52 }]}
                  value={set.reps}
                  onChangeText={(v) => updateSet(exercise.exerciseId, si, 'reps', v)}
                  keyboardType="number-pad"
                  placeholder="reps"
                  placeholderTextColor={COLORS.textMuted}
                  editable={!set.completed}
                />
                <TouchableOpacity
                  onPress={() => {
                    completeSet(exercise.exerciseId, si);
                    if (!set.completed) setShowRestModal(true);
                  }}
                  style={[styles.checkBtn, set.completed && styles.checkBtnActive]}
                >
                  <Ionicons name={set.completed ? 'checkmark' : 'checkmark'} size={16} color={set.completed ? '#FFFFFF' : COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity onPress={() => addSet(exercise.exerciseId)} style={styles.addSetBtn}>
              <Ionicons name="add" size={16} color={COLORS.accent} />
              <Text style={styles.addSetText}>Add Set</Text>
            </TouchableOpacity>
          </Card>
        ))}

        <TouchableOpacity
          style={styles.addExerciseBtn}
          onPress={() => setShowExercisePicker(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={22} color={COLORS.accent} />
          <Text style={styles.addExerciseBtnText}>ADD EXERCISE</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Exercise Picker Modal */}
      <Modal visible={showExercisePicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            <TouchableOpacity onPress={() => { setShowExercisePicker(false); setExerciseSearch(''); }}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            value={exerciseSearch}
            onChangeText={setExerciseSearch}
            placeholder="Search exercises..."
            placeholderTextColor={COLORS.textMuted}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.muscleFilter}>
            {['All', ...MUSCLE_GROUPS].map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setSelectedMuscle(m)}
                style={[styles.muscleChip, selectedMuscle === m && styles.muscleChipActive]}
              >
                <Text style={[styles.muscleChipText, selectedMuscle === m && styles.muscleChipTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            data={getFilteredExercises()}
            keyExtractor={(item, index) => `${item.name}_${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.exercisePickerItem}
                onPress={() => handleAddExercise(item.name, item.muscle_group)}
                activeOpacity={0.7}
              >
                <View>
                  <Text style={styles.exercisePickerName}>{item.name}</Text>
                  <Text style={styles.exercisePickerMeta}>{item.muscle_group} · {item.equipment}</Text>
                </View>
                <Ionicons name="add-circle-outline" size={22} color={COLORS.accent} />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>

      {/* Rest Timer Modal */}
      <Modal visible={showRestModal} transparent animationType="fade">
        <View style={styles.restModalOverlay}>
          <View style={styles.restModal}>
            <Text style={styles.restModalTitle}>Rest Timer</Text>
            <View style={styles.restOptions}>
              {REST_TIMER_OPTIONS.map((secs) => (
                <TouchableOpacity
                  key={secs}
                  style={styles.restOption}
                  onPress={() => { startRestTimer(secs); setShowRestModal(false); }}
                >
                  <Text style={styles.restOptionText}>{secs}s</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setShowRestModal(false)} style={styles.restSkipBtn}>
              <Text style={styles.restSkipBtnText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  scroll: { padding: SPACING.lg, paddingBottom: 32 },
  screenTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 2, marginBottom: SPACING.lg },

  startOptions: { flexDirection: 'row', gap: 12, marginBottom: SPACING.xl },
  startCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.border, padding: SPACING.md, gap: 10,
  },
  startIcon: { width: 48, height: 48, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  startCardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  startCardDesc: { fontSize: 13, color: COLORS.textSecondary },

  recentTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: SPACING.sm },
  recentList: { gap: 8 },
  recentCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recentCardLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  recentCardDate: { fontSize: 13, color: COLORS.textSecondary },
  emptyText: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center', paddingVertical: SPACING.lg },

  // Active Workout
  activeHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SPACING.md, paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  activeTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  activeTimer: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  activeHeaderActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  finishBtn: { backgroundColor: COLORS.accent, paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.sm },
  finishBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13, letterSpacing: 1 },
  discardIconBtn: { padding: 4 },

  restBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center',
    backgroundColor: `${COLORS.accent}15`, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: `${COLORS.accent}30`,
  },
  restText: { color: COLORS.accent, fontWeight: '700', fontSize: 14, flex: 1, textAlign: 'center' },
  restSkip: { color: COLORS.textMuted, fontSize: 13, paddingHorizontal: 12 },

  activeScroll: { padding: SPACING.md, paddingBottom: 40 },

  exerciseCard: { marginBottom: SPACING.md },
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  exerciseInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  exerciseName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
  muscleBadge: { backgroundColor: COLORS.surface2, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  muscleBadgeText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },

  setHeader: { flexDirection: 'row', alignItems: 'center', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 8 },
  setHeaderText: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 0.5 },

  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 6 },
  setRowCompleted: { opacity: 0.6 },
  setNumber: { width: 32, fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  setPrevious: { flex: 1, fontSize: 13, color: COLORS.textMuted },
  setInput: {
    backgroundColor: COLORS.surface2, borderRadius: 8, padding: 8,
    color: COLORS.textPrimary, fontSize: 15, fontWeight: '600', textAlign: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  checkBtn: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkBtnActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },

  addSetBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 10, justifyContent: 'center' },
  addSetText: { color: COLORS.accent, fontSize: 14, fontWeight: '600' },

  addExerciseBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.accent, borderStyle: 'dashed', paddingVertical: SPACING.md,
    marginTop: 4,
  },
  addExerciseBtnText: { color: COLORS.accent, fontWeight: '700', fontSize: 14, letterSpacing: 1 },

  // Exercise Picker Modal
  modalContainer: { flex: 1, backgroundColor: COLORS.bgSecondary },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  searchInput: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, color: COLORS.textPrimary, fontSize: 16, marginHorizontal: SPACING.lg, marginBottom: SPACING.sm,
  },
  muscleFilter: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm, maxHeight: 44 },
  muscleChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, marginRight: 8,
  },
  muscleChipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  muscleChipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  muscleChipTextActive: { color: '#FFFFFF' },

  exercisePickerItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.md, paddingHorizontal: SPACING.lg,
  },
  exercisePickerName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 3 },
  exercisePickerMeta: { fontSize: 13, color: COLORS.textSecondary },
  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.lg },

  // Rest Timer Modal
  restModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  restModal: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl },
  restModalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.lg, textAlign: 'center' },
  restOptions: { flexDirection: 'row', gap: 12, marginBottom: SPACING.lg },
  restOption: {
    flex: 1, backgroundColor: COLORS.surface2, borderRadius: RADIUS.md, paddingVertical: SPACING.lg,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  restOptionText: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  restSkipBtn: { alignItems: 'center', paddingVertical: SPACING.sm },
  restSkipBtnText: { color: COLORS.textMuted, fontSize: 15 },

  // Finish screen
  finishTitle: { fontSize: 28, fontWeight: '900', color: COLORS.accent, letterSpacing: -0.5, marginBottom: SPACING.xl, textAlign: 'center', marginTop: SPACING.xl },
  finishStats: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.lg, alignItems: 'center' },
  finishStat: { flex: 1, alignItems: 'center' },
  finishStatValue: { fontSize: 24, fontWeight: '900', color: COLORS.accent, letterSpacing: -0.5 },
  finishStatLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  finishDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
  finishMessage: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.xl, borderLeftWidth: 3, borderLeftColor: COLORS.accent },
  finishMessageText: { fontSize: 16, color: COLORS.textPrimary, lineHeight: 24 },
  finishActions: { gap: 12 },
  discardBtn: { alignSelf: 'center' },
});
