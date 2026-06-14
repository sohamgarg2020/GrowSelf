import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../lib/store/authStore';
import { COLORS } from '../lib/constants';

export default function Index() {
  const { session, profile, loading } = useAuthStore();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bgPrimary, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.accent} size="large" />
      </View>
    );
  }

  if (!session) return <Redirect href="/(auth)/splash" />;
  if (!profile?.onboarding_complete) return <Redirect href="/(onboarding)/welcome" />;
  return <Redirect href="/(tabs)" />;
}
