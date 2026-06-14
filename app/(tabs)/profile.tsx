import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Modal, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../lib/store/authStore';
import { supabase } from '../../lib/supabase';
import { COLORS, SPACING, RADIUS } from '../../lib/constants';
import { formatWeight, formatHeight, kgToLbs, lbsToKg } from '../../lib/utils';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

type EditField = 'name' | 'weight' | 'age' | null;

export default function ProfileScreen() {
  const { profile, user, signOut, setProfile } = useAuthStore();
  const [editField, setEditField] = useState<EditField>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const units = profile?.units_preference ?? 'imperial';

  async function handleSaveEdit() {
    if (!user || !editField || !editValue) return;
    setSaving(true);
    let updates: Record<string, any> = {};

    if (editField === 'name') updates.name = editValue.trim();
    else if (editField === 'age') updates.age = parseInt(editValue);
    else if (editField === 'weight') {
      updates.weight_kg = units === 'imperial' ? lbsToKg(parseFloat(editValue)) : parseFloat(editValue);
    }

    const { data, error } = await supabase.from('profiles').upsert({ id: user.id, ...updates }).select().single();
    setSaving(false);
    if (error) { Alert.alert('Error', error.message); return; }
    setProfile(data as any);
    setEditField(null);
  }

  async function toggleUnits() {
    if (!user || !profile) return;
    const newUnits = units === 'imperial' ? 'metric' : 'imperial';
    const { data } = await supabase.from('profiles').upsert({ id: user.id, units_preference: newUnits }).select().single();
    if (data) setProfile(data as any);
  }

  function openEdit(field: EditField) {
    if (!profile) return;
    setEditField(field);
    if (field === 'name') setEditValue(profile.name);
    else if (field === 'age') setEditValue(profile.age?.toString() ?? '');
    else if (field === 'weight') {
      setEditValue(units === 'imperial' ? `${Math.round(kgToLbs(profile.weight_kg) * 10) / 10}` : `${profile.weight_kg}`);
    }
  }

  const GOAL_LABELS: Record<string, string> = {
    build_muscle: 'Build Muscle',
    lose_fat_build_muscle: 'Lose Fat & Build Muscle',
    general_fitness: 'General Fitness',
    increase_strength: 'Increase Strength',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>PROFILE</Text>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{profile?.name?.[0] ?? 'G'}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{profile?.name ?? 'Athlete'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <View style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>{GOAL_LABELS[profile?.goal ?? ''] ?? 'No goal set'}</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <Card style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {profile?.weight_kg ? (units === 'imperial' ? `${Math.round(kgToLbs(profile.weight_kg))} lbs` : `${profile.weight_kg} kg`) : '—'}
            </Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {profile?.height_cm ? formatHeight(profile.height_cm, units) : '—'}
            </Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.age ?? '—'}</Text>
            <Text style={styles.statLabel}>Age</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.training_days_per_week ?? '—'}</Text>
            <Text style={styles.statLabel}>Days/Week</Text>
          </View>
        </Card>

        {/* Settings */}
        <Text style={styles.sectionTitle}>PERSONAL INFO</Text>
        <Card style={styles.settingsCard}>
          <SettingRow icon="person-outline" label="Name" value={profile?.name} onPress={() => openEdit('name')} />
          <SettingRow icon="barbell-outline" label="Weight" value={profile?.weight_kg ? formatWeight(profile.weight_kg, units) : undefined} onPress={() => openEdit('weight')} />
          <SettingRow icon="calendar-outline" label="Age" value={profile?.age?.toString()} onPress={() => openEdit('age')} last />
        </Card>

        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="scale-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.settingLabel}>Use Imperial (lbs)</Text>
            </View>
            <Switch
              value={units === 'imperial'}
              onValueChange={toggleUnits}
              trackColor={{ false: COLORS.surface2, true: COLORS.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.settingRow, styles.last]}>
            <View style={styles.settingLeft}>
              <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.settingLabel}>Coach Name</Text>
            </View>
            <Text style={styles.settingValue}>{profile?.coach_name ?? 'Atlas'}</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <Card style={styles.settingsCard}>
          <TouchableOpacity style={[styles.settingRow, styles.last]} onPress={() => {
            Alert.alert('Sign Out', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: signOut },
            ]);
          }}>
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              <Text style={[styles.settingLabel, { color: COLORS.error }]}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </Card>

        {/* Edit Modal */}
        <Modal visible={!!editField} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>
                Edit {editField === 'name' ? 'Name' : editField === 'weight' ? `Weight (${units === 'imperial' ? 'lbs' : 'kg'})` : 'Age'}
              </Text>
              <TextInput
                style={styles.modalInput}
                value={editValue}
                onChangeText={setEditValue}
                keyboardType={editField === 'name' ? 'default' : 'decimal-pad'}
                autoFocus
                selectionColor={COLORS.accent}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setEditField(null)} style={styles.modalCancel}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <Button label="Save" onPress={handleSaveEdit} loading={saving} fullWidth={false} style={styles.modalSave} />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ icon, label, value, onPress, last }: {
  icon: string; label: string; value?: string; onPress?: () => void; last?: boolean
}) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, last && styles.last]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={20} color={COLORS.textSecondary} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        <Text style={styles.settingValue}>{value ?? '—'}</Text>
        {onPress && <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  scroll: { padding: SPACING.lg, paddingBottom: 32 },
  screenTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 2, marginBottom: SPACING.lg },

  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.xl },
  avatarLarge: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center',
  },
  avatarLargeText: { color: '#FFFFFF', fontSize: 32, fontWeight: '900' },
  profileName: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  profileEmail: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  goalBadge: {
    backgroundColor: `${COLORS.accent}20`, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.full, marginTop: 6, alignSelf: 'flex-start',
  },
  goalBadgeText: { color: COLORS.accent, fontSize: 12, fontWeight: '600' },

  statsRow: { flexDirection: 'row', marginBottom: SPACING.xl, paddingVertical: SPACING.md },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: COLORS.border },

  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 8, marginTop: SPACING.sm },

  settingsCard: { marginBottom: SPACING.md, padding: 0, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  last: { borderBottomWidth: 0 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingLabel: { fontSize: 15, color: COLORS.textPrimary },
  settingValue: { fontSize: 15, color: COLORS.textSecondary },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  modal: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.xl, width: '85%', gap: SPACING.md },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  modalInput: {
    backgroundColor: COLORS.surface2, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, color: COLORS.textPrimary, fontSize: 18, fontWeight: '600',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 12 },
  modalCancel: { paddingHorizontal: SPACING.md },
  modalCancelText: { color: COLORS.textSecondary, fontSize: 15 },
  modalSave: { width: 80 },
});
