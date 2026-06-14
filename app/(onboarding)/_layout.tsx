import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="basic-info" />
      <Stack.Screen name="body-metrics" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="training-frequency" />
      <Stack.Screen name="training-style" />
      <Stack.Screen name="ai-intro" />
    </Stack>
  );
}
